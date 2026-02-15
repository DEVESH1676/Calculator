import { math } from '../utils/mathConfig';
import {
    type Point,
    type Dimensions,
    type GraphState,
} from '../utils/graphUtils';

// Duplicate basic types if needed or import from shared
// Web Workers have trouble with imports if not using a bundler correctly. 
// Vite handles worker imports with `?worker`.
// We will assume `mathConfig` and `graphUtils` are importable. 
// If problems arise, we might need to inline or use importScripts. 
// But Vite `import ... from ...` usually works in workers.

/* 
However, 'mathjs' might be heavy. 
Let's see if we can use the same logic. 
*/

export interface WorkerMessage {
    id: string;
    type: 'CALCULATE' | 'ANALYZE';
    payload: {
        expression: string;
        state: GraphState;
        dims: Dimensions;
        step?: number;
    };
}

export interface WorkerResponse {
    id: string;
    type: 'POINTS' | 'ANALYSIS_RESULT' | 'ERROR';
    payload: any;
}

// Reuse logic from graphUtils but adapter for Worker
// We'll copy/paste the core logic to avoid import issues if verify fails, 
// but try import first. For robustness in this environment, I'll inline the core generation 
// to ensure the worker is standalone-ish or use the existing utils if Vite allows.
// Let's rely on Vite.

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { id, type, payload } = e.data;
    const { expression, state, dims, step } = payload;

    try {
        if (type === 'CALCULATE') {
            const points = generatePointsWorker(expression, state, dims, step || 1);
            self.postMessage({ id, type: 'POINTS', payload: points });
        } else if (type === 'ANALYZE') {
            const roots = findRootsWorker(expression, state, dims);
            const extrema = findExtremaWorker(expression, state, dims);
            self.postMessage({ id, type: 'ANALYSIS_RESULT', payload: { roots, extrema } });
        }
    } catch (error) {
        self.postMessage({ id, type: 'ERROR', payload: (error as Error).message });
    }
};

// --- Inlined/Adapted Logic to ensure Worker independence/performance ---
// (Copying generatePoints logic to avoid importing 'screenToGraph' if it depends on DOM or other things, 
// though 'graphUtils' seemed pure. Let's try to be safe.)

function screenToGraphWorker(screenX: number, screenY: number, state: GraphState, dims: Dimensions) {
    const centerX = dims.width / 2 + state.offsetX;
    const centerY = dims.height / 2 + state.offsetY;
    const x = (screenX - centerX) / state.scale;
    const y = (centerY - screenY) / state.scale;
    return { x, y };
}

function generatePointsWorker(expression: string, state: GraphState, dims: Dimensions, step: number): Point[] {
    if (!expression) return [];
    const points: Point[] = [];
    const scope = { x: 0 };
    let code;
    try {
        code = math.compile(expression);
    } catch {
        return [];
    }

    const buffer = 50;
    // We need to invert logic carefully or just use the math.
    // We want X range.
    const leftGraphX = screenToGraphWorker(0 - buffer, 0, state, dims).x;
    const rightGraphX = screenToGraphWorker(dims.width + buffer, 0, state, dims).x;

    // We iterate in graph steps corresponding to 1 pixel (or 'step' pixels)
    // 1 pixel = 1/scale
    const graphStep = (1 / state.scale) * step;

    // Optimize: if scale is huge (zoomed in), graphStep is tiny. 
    // If scale is small (zoomed out), graphStep is large.

    for (let x = leftGraphX; x <= rightGraphX; x += graphStep) {
        try {
            scope.x = x;
            const y = code.evaluate(scope);
            if (typeof y === 'number' && isFinite(y)) {
                points.push({ x, y });
            } else {
                points.push({ x, y: NaN });
            }
        } catch {
            points.push({ x, y: NaN });
        }
    }
    return points;
}

function findRootsWorker(expression: string, state: GraphState, dims: Dimensions): Point[] {
    // Similar to graphUtils
    const buffer = 50;
    const start = screenToGraphWorker(0 - buffer, 0, state, dims).x;
    const end = screenToGraphWorker(dims.width + buffer, 0, state, dims).x;

    // ... root finding logic ...
    // Simplified for brevity in this worker proof-of-concept
    // We can use the same logic as graphUtils.ts
    const roots: Point[] = [];
    let code;
    try { code = math.compile(expression); } catch { return []; }

    const step = 0.05; // Coarse
    const scope = { x: 0 };
    let prevY: number | null = null;
    let prevX: number | null = null;

    for (let x = start; x <= end; x += step) {
        scope.x = x;
        try {
            const y = code.evaluate(scope);
            if (typeof y !== 'number' || !isFinite(y)) { prevY = null; prevX = null; continue; }

            if (Math.abs(y) < 1e-10) roots.push({ x, y: 0 });
            else if (prevY !== null && prevX !== null && Math.sign(y) !== Math.sign(prevY)) {
                const xRoot = prevX - (prevY * (x - prevX)) / (y - prevY);
                roots.push({ x: xRoot, y: 0 });
            }
            prevY = y; prevX = x;
        } catch { prevY = null; prevX = null; }
    }
    return roots;
}

function findExtremaWorker(expression: string, state: GraphState, dims: Dimensions): Point[] {
    const buffer = 50;
    const start = screenToGraphWorker(0 - buffer, 0, state, dims).x;
    const end = screenToGraphWorker(dims.width + buffer, 0, state, dims).x;
    const extrema: Point[] = [];
    let code;
    try { code = math.compile(expression); } catch { return []; }

    const step = 0.1;
    let yPrev: number | null = null;
    let yCurr: number | null = null;
    const scope = { x: 0 };

    for (let x = start; x <= end; x += step) {
        try {
            scope.x = x;
            const y = code.evaluate(scope);
            if (typeof y !== 'number' || !isFinite(y)) { yPrev = null; yCurr = null; continue; }
            if (yCurr !== null && yPrev !== null) {
                if (yPrev < yCurr && yCurr > y) extrema.push({ x: x - step, y: yCurr });
                if (yPrev > yCurr && yCurr < y) extrema.push({ x: x - step, y: yCurr });
            }
            yPrev = yCurr; yCurr = y;
        } catch { yPrev = null; yCurr = null; }
    }
    return extrema;
}
