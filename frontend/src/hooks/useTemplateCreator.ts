import { useState, useCallback, useRef } from 'react';
import type { 
  TemplateCanvas, 
  TemplateElement, 
  TemplateCreatorState, 
  CanvasEvent,
  ExportOptions 
} from '../types/template-creator';

const createDefaultCanvas = (): TemplateCanvas => ({
  id: 'canvas-1',
  name: 'New Template',
  width: 794, // A4 width in pixels at 96 DPI
  height: 1123, // A4 height in pixels at 96 DPI
  backgroundColor: '#ffffff',
  elements: [],
  gridSize: 10,
  showGrid: true,
  snapToGrid: true,
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
});

const createNewElement = (type: TemplateElement['type'], x: number, y: number): TemplateElement => ({
  id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  x,
  y,
  width: type === 'text' ? 200 : 100,
  height: type === 'text' ? 50 : 100,
  rotation: 0,
  zIndex: 1,
  locked: false,
  visible: true,
  name: `${type}-${Date.now()}`,
  data: getDefaultElementData(type),
  style: getDefaultElementStyle(type),
});

const getDefaultElementData = (type: TemplateElement['type']) => {
  switch (type) {
    case 'text':
      return { text: 'Sample Text', fontSize: 16, fontFamily: 'Arial', fontWeight: 'normal', textAlign: 'left' as const };
    case 'cv-field':
      return { fieldType: 'personal-info' as const, fieldKey: 'firstName', placeholder: 'First Name' };
    case 'rectangle':
      return { fillColor: '#3b82f6', strokeColor: '#1e40af', strokeWidth: 2 };
    case 'circle':
      return { fillColor: '#10b981', strokeColor: '#059669', strokeWidth: 2 };
    case 'line':
      return { strokeColor: '#000000', strokeWidth: 2, x2: 100, y2: 0 };
    case 'image':
      return { src: '', alt: 'Image' };
    default:
      return {};
  }
};

const getDefaultElementStyle = (type: TemplateElement['type']) => {
  switch (type) {
    case 'text':
    case 'cv-field':
      return { opacity: 1 };
    case 'rectangle':
    case 'circle':
      return { opacity: 1, borderRadius: 0 };
    case 'line':
      return { opacity: 1 };
    case 'image':
      return { opacity: 1, borderRadius: 4 };
    default:
      return { opacity: 1 };
  }
};

export const useTemplateCreator = (initialCanvas?: Partial<TemplateCanvas>) => {
  const [state, setState] = useState<TemplateCreatorState>({
    canvas: { ...createDefaultCanvas(), ...initialCanvas },
    selectedElements: [],
    clipboard: [],
    history: [{ ...createDefaultCanvas(), ...initialCanvas }],
    historyIndex: 0,
    isDirty: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    tool: 'select',
    isDragging: false,
    dragStart: null,
    isResizing: false,
    resizeHandle: null,
  });

  // Add to history for undo/redo
  const addToHistory = useCallback((canvas: TemplateCanvas) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({ ...canvas, modified: new Date().toISOString() });
      
      // Limit history size to 50 items
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      };
    });
  }, []);

  // Update canvas
  const updateCanvas = useCallback((updates: Partial<TemplateCanvas>) => {
    setState(prev => {
      const updatedCanvas = { ...prev.canvas, ...updates, modified: new Date().toISOString() };
      return {
        ...prev,
        canvas: updatedCanvas,
        isDirty: true,
      };
    });
  }, []);

  // Update elements
  const updateElements = useCallback((elements: TemplateElement[]) => {
    setState(prev => {
      const updatedCanvas = {
        ...prev.canvas,
        elements,
        modified: new Date().toISOString(),
      };
      return {
        ...prev,
        canvas: updatedCanvas,
        isDirty: true,
      };
    });
  }, []);

  // Add element
  const addElement = useCallback((type: TemplateElement['type'], x: number, y: number) => {
    const newElement = createNewElement(type, x, y);
    setState(prev => {
      const updatedCanvas = {
        ...prev.canvas,
        elements: [...prev.canvas.elements, newElement],
        modified: new Date().toISOString(),
      };
      return {
        ...prev,
        canvas: updatedCanvas,
        selectedElements: [newElement.id],
        isDirty: true,
      };
    });
  }, []);

  // Update element
  const updateElement = useCallback((element: TemplateElement) => {
    setState(prev => {
      const updatedCanvas = {
        ...prev.canvas,
        elements: prev.canvas.elements.map(el => 
          el.id === element.id ? element : el
        ),
        modified: new Date().toISOString(),
      };
      return {
        ...prev,
        canvas: updatedCanvas,
        isDirty: true,
      };
    });
  }, []);

  // Delete elements
  const deleteElements = useCallback((elementIds: string[]) => {
    setState(prev => {
      const updatedCanvas = {
        ...prev.canvas,
        elements: prev.canvas.elements.filter(el => !elementIds.includes(el.id)),
        modified: new Date().toISOString(),
      };
      return {
        ...prev,
        canvas: updatedCanvas,
        selectedElements: [],
        isDirty: true,
      };
    });
  }, []);

  // Select elements
  const selectElements = useCallback((elementIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedElements: elementIds,
    }));
  }, []);

  // Copy elements
  const copyElements = useCallback(() => {
    setState(prev => {
      const elementsToCopy = prev.canvas.elements.filter(el => prev.selectedElements.includes(el.id));
      return {
        ...prev,
        clipboard: elementsToCopy.map(el => ({ ...el, id: `${el.id}-copy` })),
      };
    });
  }, []);

  // Paste elements
  const pasteElements = useCallback(() => {
    setState(prev => {
      const pastedElements = prev.clipboard.map(el => ({
        ...el,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: el.x + 20,
        y: el.y + 20,
      }));
      
      const updatedCanvas = {
        ...prev.canvas,
        elements: [...prev.canvas.elements, ...pastedElements],
        modified: new Date().toISOString(),
      };
      
      return {
        ...prev,
        canvas: updatedCanvas,
        selectedElements: pastedElements.map(el => el.id),
        isDirty: true,
      };
    });
  }, []);

  // Undo
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          canvas: { ...prev.history[newIndex] },
          historyIndex: newIndex,
          selectedElements: [],
          isDirty: newIndex !== 0,
        };
      }
      return prev;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          canvas: { ...prev.history[newIndex] },
          historyIndex: newIndex,
          selectedElements: [],
          isDirty: true,
        };
      }
      return prev;
    });
  }, []);

  // Bring to front
  const bringToFront = useCallback(() => {
    setState(prev => {
      const maxZIndex = Math.max(...prev.canvas.elements.map(el => el.zIndex), 0);
      const updatedElements = prev.canvas.elements.map(el => 
        prev.selectedElements.includes(el.id) 
          ? { ...el, zIndex: maxZIndex + 1 }
          : el
      );
      
      const updatedCanvas = {
        ...prev.canvas,
        elements: updatedElements,
        modified: new Date().toISOString(),
      };
      
      return {
        ...prev,
        canvas: updatedCanvas,
        isDirty: true,
      };
    });
  }, []);

  // Send to back
  const sendToBack = useCallback(() => {
    setState(prev => {
      const minZIndex = Math.min(...prev.canvas.elements.map(el => el.zIndex), 0);
      const updatedElements = prev.canvas.elements.map(el => 
        prev.selectedElements.includes(el.id) 
          ? { ...el, zIndex: minZIndex - 1 }
          : el
      );
      
      const updatedCanvas = {
        ...prev.canvas,
        elements: updatedElements,
        modified: new Date().toISOString(),
      };
      
      return {
        ...prev,
        canvas: updatedCanvas,
        isDirty: true,
      };
    });
  }, []);

  // Handle canvas events
  const handleCanvasEvent = useCallback((event: CanvasEvent) => {
    const { tool } = state;
    
    if (event.type === 'mousedown' && tool !== 'select') {
      // Create new element based on active tool
      let elementType: TemplateElement['type'];
      switch (tool) {
        case 'text':
          elementType = 'text';
          break;
        case 'cv-field':
          elementType = 'cv-field';
          break;
        case 'shape':
          elementType = 'rectangle';
          break;
        case 'line':
          elementType = 'line';
          break;
        default:
          elementType = 'text';
      }
      
      addElement(elementType, event.x, event.y);
    }
  }, [state.tool, addElement]);

  // Export template
  const exportTemplate = useCallback((options: ExportOptions) => {
    const templateData = {
      canvas: state.canvas,
      metadata: {
        exported: new Date().toISOString(),
        version: '1.0.0',
      },
    };
    
    switch (options.format) {
      case 'json':
        return JSON.stringify(templateData, null, 2);
      case 'png':
      case 'svg':
      case 'pdf':
        // These would be implemented with canvas rendering
        return templateData;
      default:
        return templateData;
    }
  }, [state.canvas]);

  // Import template
  const importTemplate = useCallback((templateData: any) => {
    try {
      const parsed = typeof templateData === 'string' ? JSON.parse(templateData) : templateData;
      if (parsed.canvas) {
        setState(prev => ({
          ...prev,
          canvas: { ...parsed.canvas, id: `canvas-${Date.now()}` },
          selectedElements: [],
          isDirty: true,
        }));
        return true;
      }
    } catch (error) {
      console.error('Failed to import template:', error);
    }
    return false;
  }, []);

  // Reset canvas
  const resetCanvas = useCallback(() => {
    setState(prev => ({
      ...prev,
      canvas: createDefaultCanvas(),
      selectedElements: [],
      history: [createDefaultCanvas()],
      historyIndex: 0,
      isDirty: false,
      zoom: 1,
      panX: 0,
      panY: 0,
    }));
  }, []);

  return {
    // State
    state,
    
    // Canvas operations
    updateCanvas,
    updateElements,
    addElement,
    updateElement,
    deleteElements,
    selectElements,
    
    // Edit operations
    copyElements,
    pasteElements,
    undo,
    redo,
    bringToFront,
    sendToBack,
    
    // View operations
    setZoom: (zoom: number) => setState(prev => ({ ...prev, zoom })),
    setPan: (panX: number, panY: number) => setState(prev => ({ ...prev, panX, panY })),
    setTool: (tool: 'select' | 'text' | 'shape' | 'line' | 'cv-field') => setState(prev => ({ ...prev, tool })),
    
    // Grid operations
    toggleGrid: () => setState(prev => ({ 
      ...prev, 
      canvas: { ...prev.canvas, showGrid: !prev.canvas.showGrid }
    })),
    toggleSnap: () => setState(prev => ({ 
      ...prev, 
      canvas: { ...prev.canvas, snapToGrid: !prev.canvas.snapToGrid }
    })),
    
    // Event handling
    handleCanvasEvent,
    
    // Import/Export
    exportTemplate,
    importTemplate,
    resetCanvas,
    
    // Computed values
    selectedElements: state.canvas.elements.filter(el => state.selectedElements.includes(el.id)),
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    hasSelection: state.selectedElements.length > 0,
    hasClipboard: state.clipboard.length > 0,
  };
};
