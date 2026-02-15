import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCalculatorStore } from '../store/useCalculatorStore';
import {
  type Dimensions,
  type GraphState,
  type Point,
  generatePoints,
  screenToGraph,
  graphToScreen,
  findRoots,
  findExtrema,
} from '../utils/graphUtils';
import { Plus, Minus, RotateCcw, Target } from 'lucide-react';

const GraphPanel: React.FC = () => {
  const { theme } = useTheme();
  const { history } = useCalculatorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Graph State
  const stateRef = useRef<GraphState>({
    offsetX: 0,
    offsetY: 0,
    scale: 40, // Pixels per unit
  });

  const [expression, setExpression] = useState<string>('');
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Analysis Data (Roots/Extrema)
  const [analysisPoints, setAnalysisPoints] = useState<{ roots: Point[]; extrema: Point[] }>({
    roots: [],
    extrema: [],
  });

  // Sync expression from history
  useEffect(() => {
    if (history.length > 0) {
      const lastItem = history[0];
      const targetExpr = lastItem.expression.includes('x') ? lastItem.expression : 'sin(x) * x';
      if (expression !== targetExpr) {
        setExpression(targetExpr);
      }
    } else {
      if (expression !== 'sin(x) * x') {
        setExpression('sin(x) * x');
      }
    }
  }, [history]);

  // Calculate Analysis Points (Debounced ideally, but here on expression/view change triggers)
  // For now, I'll trigger it when user toggles "Target" (Analysis) mode to save perf
  useEffect(() => {
    if (!showAnalysis || !expression) return;

    // We calculate for a generous range around the current view?
    // Or just the visible view. Visible view is better for performance.
    // We need dimensions.
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const dims = { width: clientWidth, height: clientHeight };
    const state = stateRef.current;

    const buffer = 50;
    const start = screenToGraph(0 - buffer, 0, state, dims).x;
    const end = screenToGraph(clientWidth + buffer, 0, state, dims).x;

    const roots = findRoots(expression, start, end, 0.05); // finer step for root finding
    const extrema = findExtrema(expression, start, end, 0.1);

    setAnalysisPoints({ roots, extrema });
  }, [expression, showAnalysis]); // Re-run on move? Expensive.

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const { clientWidth, clientHeight } = container;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    }

    const width = canvas.width;
    const height = canvas.height;
    const dims: Dimensions = { width, height };
    const state = stateRef.current;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const isDark = theme.bg.includes('black') || theme.bg.includes('slate-900');

    // --- Grid ---
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const topLeft = screenToGraph(0, 0, state, dims);
    const bottomRight = screenToGraph(width, height, state, dims);

    // Vertical lines
    const startX = Math.floor(topLeft.x);
    const endX = Math.ceil(bottomRight.x);
    for (let x = startX; x <= endX; x++) {
      const screenPt = graphToScreen(x, 0, state, dims);
      ctx.moveTo(screenPt.x, 0);
      ctx.lineTo(screenPt.x, height);
    }

    // Horizontal lines
    const startY = Math.floor(bottomRight.y);
    const endY = Math.ceil(topLeft.y);
    for (let y = startY; y <= endY; y++) {
      const screenPt = graphToScreen(0, y, state, dims);
      ctx.moveTo(0, screenPt.y);
      ctx.lineTo(width, screenPt.y);
    }
    ctx.stroke();

    // --- Axes ---
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const origin = graphToScreen(0, 0, state, dims);
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y); // X Axis
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height); // Y Axis
    ctx.stroke();

    // --- Function ---
    if (expression) {
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const points = generatePoints(expression, state, dims);

      let first = true;
      for (const p of points) {
        if (isNaN(p.y) || !isFinite(p.y)) {
          first = true;
          continue;
        }
        const screenPt = graphToScreen(p.x, p.y, state, dims);
        if (first) {
          ctx.moveTo(screenPt.x, screenPt.y);
          first = false;
        } else {
          ctx.lineTo(screenPt.x, screenPt.y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // --- Analysis Points (Roots / Extrema) ---
    if (showAnalysis) {
      // Roots (Red)
      ctx.fillStyle = '#ff4444';
      analysisPoints.roots.forEach((p) => {
        const sp = graphToScreen(p.x, p.y, state, dims);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      // Extrema (Yellow)
      ctx.fillStyle = '#ffbb33';
      analysisPoints.extrema.forEach((p) => {
        const sp = graphToScreen(p.x, p.y, state, dims);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // --- Crosshair & Coords ---
    if (isHovering.current) {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const graphPt = screenToGraph(mx, my, state, dims);

      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, height);
      ctx.moveTo(0, my);
      ctx.lineTo(width, my);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Tooltip text
      const text = `(${graphPt.x.toFixed(2)}, ${graphPt.y.toFixed(2)})`;
      ctx.font = '12px monospace';
      ctx.fillStyle = isDark ? '#fff' : '#000';
      ctx.fillText(text, mx + 10, my - 10);
    }
  }, [expression, theme, showAnalysis, analysisPoints]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      // Only redraw if needed? For now, 60fps is fine for smooth interaction
      draw();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.classList.add('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      stateRef.current.offsetX += dx;
      stateRef.current.offsetY += dy;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    containerRef.current?.classList.remove('cursor-grabbing');
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const factor = 1 + direction * zoomIntensity;
    stateRef.current.scale *= factor;
    stateRef.current.scale = Math.max(5, Math.min(500, stateRef.current.scale));
  };

  const handleZoomIn = () => {
    stateRef.current.scale *= 1.2;
  };
  const handleZoomOut = () => {
    stateRef.current.scale /= 1.2;
  };
  const handleReset = () => {
    stateRef.current = { offsetX: 0, offsetY: 0, scale: 40 };
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className={`px-3 py-2 rounded-lg ${theme.bg} ${theme.text} border ${theme.border} outline-none shadow-lg w-64 opacity-90 hover:opacity-100 transition-opacity`}
          placeholder="Enter function aka sin(x)"
        />
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className={`p-2 rounded-lg ${showAnalysis ? theme.accent : theme.buttonBg} ${theme.text} shadow-lg transition-colors border ${theme.border}`}
          title="Toggle Analysis (Roots/Extrema)"
        >
          <Target size={20} />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className={`p-2 rounded-full ${theme.buttonBg} ${theme.text} shadow-lg hover:scale-110 transition-transform`}
        >
          <Plus size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className={`p-2 rounded-full ${theme.buttonBg} ${theme.text} shadow-lg hover:scale-110 transition-transform`}
        >
          <Minus size={20} />
        </button>
        <button
          onClick={handleReset}
          className={`p-2 rounded-full ${theme.buttonBg} ${theme.text} shadow-lg hover:scale-110 transition-transform`}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 w-full h-full cursor-crosshair overflow-hidden rounded-2xl border ${theme.border} bg-black/5`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          isHovering.current = false;
        }}
        onMouseEnter={() => {
          isHovering.current = true;
        }}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="text-center text-xs opacity-50 mt-1">
        Pan: Drag | Zoom: Scroll | Analysis: Target Icon
      </div>
    </div>
  );
};

export default GraphPanel;
