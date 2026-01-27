import { useEffect, useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';

export const useCanvasDragResize = () => {
  const {
    state,
    dispatch,
    dragState,
    resizeState,
    setDragState,
    setResizeState,
  } = useCanvas();

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging && dragState.elementId) {
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;
      
      dispatch({
        type: 'MOVE_ELEMENTS',
        ids: [dragState.elementId],
        deltaX,
        deltaY,
      });
    }

    if (resizeState.isResizing && resizeState.elementId) {
      const deltaX = e.clientX - resizeState.startX;
      const deltaY = e.clientY - resizeState.startY;
      
      let newWidth = resizeState.originalWidth;
      let newHeight = resizeState.originalHeight;
      let newX = resizeState.originalX;
      let newY = resizeState.originalY;

      switch (resizeState.handle) {
        case 'top-left':
          newWidth = resizeState.originalWidth - deltaX;
          newHeight = resizeState.originalHeight - deltaY;
          newX = resizeState.originalX + deltaX;
          newY = resizeState.originalY + deltaY;
          break;
        case 'top-right':
          newWidth = resizeState.originalWidth + deltaX;
          newHeight = resizeState.originalHeight - deltaY;
          newY = resizeState.originalY + deltaY;
          break;
        case 'bottom-left':
          newWidth = resizeState.originalWidth - deltaX;
          newHeight = resizeState.originalHeight + deltaY;
          newX = resizeState.originalX + deltaX;
          break;
        case 'bottom-right':
          newWidth = resizeState.originalWidth + deltaX;
          newHeight = resizeState.originalHeight + deltaY;
          break;
        case 'top':
          newHeight = resizeState.originalHeight - deltaY;
          newY = resizeState.originalY + deltaY;
          break;
        case 'right':
          newWidth = resizeState.originalWidth + deltaX;
          break;
        case 'bottom':
          newHeight = resizeState.originalHeight + deltaY;
          break;
        case 'left':
          newWidth = resizeState.originalWidth - deltaX;
          newX = resizeState.originalX + deltaX;
          break;
      }

      // Minimum size constraints
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);

      dispatch({
        type: 'UPDATE_ELEMENT',
        id: resizeState.elementId,
        updates: {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        },
      });
    }
  }, [dragState, resizeState, dispatch]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        elementId: null,
        startX: 0,
        startY: 0,
        originalX: 0,
        originalY: 0,
      });
    }

    if (resizeState.isResizing) {
      setResizeState({
        isResizing: false,
        elementId: null,
        handle: null,
        startX: 0,
        startY: 0,
        originalWidth: 0,
        originalHeight: 0,
        originalX: 0,
        originalY: 0,
      });
    }
  }, [dragState.isDragging, resizeState.isResizing, setDragState, setResizeState]);

  // Set up global event listeners
  useEffect(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, resizeState.isResizing, handleMouseMove, handleMouseUp]);

  // Snap to grid helper
  const snapToGrid = useCallback((value: number): number => {
    if (!state.snapToGrid) return value;
    return Math.round(value / state.gridSize) * state.gridSize;
  }, [state.snapToGrid, state.gridSize]);

  return {
    snapToGrid,
  };
};

export default useCanvasDragResize;
