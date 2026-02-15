import { math } from './mathConfig';

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface GraphState {
  offsetX: number;
  offsetY: number;
  scale: number;
}

// Convert screen coordinates to graph coordinates
export const screenToGraph = (
  screenX: number,
  screenY: number,
  state: GraphState,
  dims: Dimensions
): Point => {
  const centerX = dims.width / 2 + state.offsetX;
  const centerY = dims.height / 2 + state.offsetY;

  const x = (screenX - centerX) / state.scale;
  const y = (centerY - screenY) / state.scale; // Y is inverted on screen

  return { x, y };
};

// Convert graph coordinates to screen coordinates
export const graphToScreen = (
  graphX: number,
  graphY: number,
  state: GraphState,
  dims: Dimensions
): Point => {
  const centerX = dims.width / 2 + state.offsetX;
  const centerY = dims.height / 2 + state.offsetY;

  const x = centerX + graphX * state.scale;
  const y = centerY - graphY * state.scale;

  return { x, y };
};

// Generate points for the graph
export const generatePoints = (
  expression: string,
  state: GraphState,
  dims: Dimensions,
  step: number = 1 // Pixel step
): Point[] => {
  if (!expression) return [];
  // Safety: Prevent extremely small steps hanging the thread
  if (step < 0.1) step = 0.1;

  const points: Point[] = [];
  const scope = { x: 0 };
  let code;
  try {
    code = math.compile(expression);
  } catch {
    return [];
  }

  // Calculate visible X range based on screen width
  // Optimization: Render a bit outside the screen for smoothness
  const buffer = 50;
  const leftGraphX = screenToGraph(0 - buffer, 0, state, dims).x;
  const rightGraphX = screenToGraph(dims.width + buffer, 0, state, dims).x;

  // Determine step size in graph units
  // 1 pixel on screen = 1/scale graph units
  const graphStep = (1 / state.scale) * step;

  for (let x = leftGraphX; x <= rightGraphX; x += graphStep) {
    try {
      scope.x = x;
      const y = code.evaluate(scope);

      if (typeof y === 'number' && isFinite(y)) {
        points.push({ x, y });
      } else {
        // Determine if we should break the line (NaN or Infinity)
        points.push({ x, y: NaN });
      }
    } catch {
      // Expression might be invalid for certain X (e.g. log(-1))
      points.push({ x, y: NaN });
    }
  }

  return points;
};

// Find Roots (y = 0) in the visible range
export const findRoots = (
  expression: string,
  start: number,
  end: number,
  step: number = 0.1
): Point[] => {
  const roots: Point[] = [];
  const scope = { x: 0 };
  let code;
  try {
    code = math.compile(expression);
  } catch {
    return [];
  }

  let prevY: number | null = null;
  let prevX: number | null = null;

  for (let x = start; x <= end; x += step) {
    scope.x = x;
    try {
      const y = code.evaluate(scope);
      if (typeof y !== 'number' || !isFinite(y)) {
        prevY = null;
        prevX = null;
        continue;
      }

      if (Math.abs(y) < 1e-10) {
        roots.push({ x, y: 0 }); // Exact root
      } else if (prevY !== null && prevX !== null) {
        // Sign change detected -> root exists between prevX and x
        if (Math.sign(y) !== Math.sign(prevY)) {
          // Linear interpolation for better precision
          // x_root = x1 - y1 * (x2 - x1) / (y2 - y1)
          const xRoot = prevX - (prevY * (x - prevX)) / (y - prevY);
          roots.push({ x: xRoot, y: 0 });
        }
      }

      prevY = y;
      prevX = x;
    } catch {
      prevY = null;
      prevX = null;
    }
  }
  return roots;
};

// Simple Extrema finding (simulating derivative check by looking at neighbors)
export const findExtrema = (
  expression: string,
  start: number,
  end: number,
  step: number = 0.1
): Point[] => {
  const extrema: Point[] = [];
  const scope = { x: 0 };
  let code;
  try {
    code = math.compile(expression);
  } catch {
    return [];
  }

  // We check locally for peaks/valleys
  // y[i-1] < y[i] > y[i+1] (max)
  // y[i-1] > y[i] < y[i+1] (min)

  let yPrev: number | null = null;
  let yCurr: number | null = null;

  // Initialize first point
  try {
    const scope = { x: start };
    yPrev = code.evaluate(scope);
  } catch {
    // ignore
  }

  for (let x = start + step; x <= end; x += step) {
    try {
      scope.x = x;
      const y = code.evaluate(scope);

      if (typeof y !== 'number' || !isFinite(y)) {
        yPrev = null;
        yCurr = null;
        continue;
      }

      if (yCurr !== null && yPrev !== null) {
        // Check for Local Max
        if (yPrev < yCurr && yCurr > y) {
          // Approximate X
          extrema.push({ x: x - step, y: yCurr });
        }
        // Check for Local Min
        if (yPrev > yCurr && yCurr < y) {
          extrema.push({ x: x - step, y: yCurr });
        }
      }

      yPrev = yCurr;
      yCurr = y;
    } catch {
      yPrev = null;
      yCurr = null;
    }
  }

  return extrema;
};
