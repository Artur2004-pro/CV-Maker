import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CanvasContextType, CanvasState, DragState, ResizeState, CanvasToolbar } from '../types/canvas';
import { canvasReducer } from '../store/canvasReducer';

const initialDragState: DragState = {
  isDragging: false,
  elementId: null,
  startX: 0,
  startY: 0,
  originalX: 0,
  originalY: 0,
};

const initialResizeState: ResizeState = {
  isResizing: false,
  elementId: null,
  handle: null,
  startX: 0,
  startY: 0,
  originalWidth: 0,
  originalHeight: 0,
  originalX: 0,
  originalY: 0,
};

const initialToolbar: CanvasToolbar = {
  tool: 'select',
  isActive: false,
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, {
    elements: [],
    selectedElementIds: [],
    clipboard: [],
    history: [],
    historyIndex: -1,
    canvasWidth: 794,
    canvasHeight: 1123,
    zoom: 1,
    panX: 0,
    panY: 0,
    gridEnabled: true,
    snapToGrid: true,
    gridSize: 8,
  });

  const [dragState, setDragState] = React.useState<DragState>(initialDragState);
  const [resizeState, setResizeState] = React.useState<ResizeState>(initialResizeState);
  const [toolbar, setToolbar] = React.useState<CanvasToolbar>(initialToolbar);

  const value: CanvasContextType = {
    state,
    dispatch,
    dragState,
    resizeState,
    toolbar,
    setDragState,
    setResizeState,
    setToolbar,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

export default CanvasContext;
