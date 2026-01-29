import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import { CanvasElement } from '../../types/canvas';
import CanvasElementComponent from './CanvasElement';
import CanvasToolbar from './CanvasToolbar';
import CanvasProperties from './CanvasProperties';
import CanvasSaveLoad from './CanvasSaveLoad';
import { useCanvasDragResize } from '../../hooks/useCanvasDragResize';
import './CanvasEditor.css';

const CanvasEditor: React.FC = () => {
  const {
    state,
    dispatch,
    dragState,
    resizeState,
    setDragState,
    setResizeState,
  } = useCanvas();

  // Debug: Log elements count
  useEffect(() => {
    console.log('[CanvasEditor] Elements in state:', state.elements.length, state.elements.map(el => ({
      id: el.id,
      type: el.type,
      visible: el.visible,
      x: el.x,
      y: el.y
    })));
  }, [state.elements.length, state.elements]);

  const { snapToGrid } = useCanvasDragResize();

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on canvas
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      dispatch({ type: 'SELECT_ELEMENTS', ids: [] });
    }
  }, [dispatch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' && state.selectedElementIds.length > 0) {
        state.selectedElementIds.forEach(id => {
          dispatch({ type: 'DELETE_ELEMENT', id });
        });
      }

      // Copy (Ctrl+C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.selectedElementIds.length > 0) {
        dispatch({ type: 'COPY_ELEMENTS', ids: state.selectedElementIds });
      }

      // Paste (Ctrl+V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        dispatch({ type: 'PASTE_ELEMENTS' });
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        dispatch({ type: 'UNDO' });
      }

      // Redo (Ctrl+Shift+Z or Ctrl+Y)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        dispatch({ type: 'REDO' });
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && state.selectedElementIds.length > 0) {
        e.preventDefault();
        dispatch({ type: 'DUPLICATE_ELEMENTS', ids: state.selectedElementIds });
      }

      // Select all (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = state.elements.map(el => el.id);
        dispatch({ type: 'SELECT_ELEMENTS', ids: allIds });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementIds, state.elements, dispatch]);

  // Handle wheel for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, state.zoom * delta));
      dispatch({ type: 'SET_ZOOM', zoom: newZoom });
    }
  }, [state.zoom, dispatch]);

  // Snap to grid function
  const snapToGridValue = useCallback((value: number): number => {
    if (!state.snapToGrid) return value;
    return Math.round(value / state.gridSize) * state.gridSize;
  }, [state.snapToGrid, state.gridSize]);

  // Render grid
  const renderGrid = () => {
    if (!state.gridEnabled) return null;

    const gridLines = [];
    const gridSize = state.gridSize * state.zoom;

    for (let x = 0; x <= state.canvasWidth; x += state.gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x * state.zoom}
          y1={0}
          x2={x * state.zoom}
          y2={state.canvasHeight * state.zoom}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      );
    }

    for (let y = 0; y <= state.canvasHeight; y += state.gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y * state.zoom}
          x2={state.canvasWidth * state.zoom}
          y2={y * state.zoom}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={state.canvasWidth * state.zoom}
        height={state.canvasHeight * state.zoom}
      >
        {gridLines}
      </svg>
    );
  };

  return (
    <div className="canvas-editor flex h-screen bg-gray-100">
      {/* Toolbar */}
      <CanvasToolbar />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Zoom: {Math.round(state.zoom * 100)}%
            </span>
            <span className="text-sm text-gray-600">
              Canvas: {state.canvasWidth} × {state.canvasHeight}
            </span>
            <span className="text-sm text-gray-600">
              Elements: {state.elements.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.historyIndex <= 0}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo
            </button>
            <button
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.historyIndex >= state.history.length - 1}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Redo
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
              className={`px-3 py-1 text-sm rounded ${
                state.gridEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SNAP_TO_GRID' })}
              className={`px-3 py-1 text-sm rounded ${
                state.snapToGrid ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Snap
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-50 p-8"
          onWheel={handleWheel}
        >
          <div
            className="relative bg-white shadow-lg"
            style={{
              width: state.canvasWidth * state.zoom,
              height: state.canvasHeight * state.zoom,
              transform: `translate(${state.panX}px, ${state.panY}px)`,
            }}
          >
            {/* Grid */}
            {renderGrid()}

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="absolute inset-0"
              onMouseDown={handleCanvasMouseDown}
              style={{
                width: state.canvasWidth,
                height: state.canvasHeight,
                transform: `scale(${state.zoom})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Render Elements */}
              {state.elements.length > 0 ? (
                state.elements
                  .filter(element => element.visible !== false)
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((element) => (
                    <CanvasElementComponent
                      key={element.id}
                      element={element}
                      isSelected={state.selectedElementIds.includes(element.id)}
                      snapToGrid={snapToGridValue}
                    />
                  ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  No elements to display. Import a PDF or create elements.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <CanvasSaveLoad />
        <CanvasProperties />
      </div>
    </div>
  );
};

export default CanvasEditor;
