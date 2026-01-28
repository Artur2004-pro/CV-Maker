import { CanvasState, CanvasAction, CanvasElement } from '../types/canvas';

const initialState: CanvasState = {
  elements: [],
  selectedElementIds: [],
  clipboard: [],
  history: [],
  historyIndex: -1,
  canvasWidth: 794, // A4 width in pixels at 96 DPI
  canvasHeight: 1123, // A4 height in pixels at 96 DPI
  zoom: 1,
  panX: 0,
  panY: 0,
  gridEnabled: true,
  snapToGrid: true,
  gridSize: 8,
};

export const canvasReducer = (state: CanvasState = initialState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newState: CanvasState = {
        ...state,
        elements: [...state.elements, action.element],
        selectedElementIds: [action.element.id],
      };
      return saveToHistory(newState, state);
    }

    case 'UPDATE_ELEMENT': {
      const elements = state.elements.map(el => {
        if (el.id === action.id) {
          return { ...el, ...action.updates } as CanvasElement;
        }
        return el;
      });
      const newState: CanvasState = { ...state, elements };
      return saveToHistory(newState, state);
    }

    case 'DELETE_ELEMENT': {
      const elements = state.elements.filter(el => el.id !== action.id);
      const selectedElementIds = state.selectedElementIds.filter(id => id !== action.id);
      const newState: CanvasState = { ...state, elements, selectedElementIds };
      return saveToHistory(newState, state);
    }

    case 'SELECT_ELEMENTS': {
      return { ...state, selectedElementIds: action.ids };
    }

    case 'MOVE_ELEMENTS': {
      const elements = state.elements.map(el => {
        if (action.ids.includes(el.id)) {
          return {
            ...el,
            x: el.x + action.deltaX,
            y: el.y + action.deltaY,
          };
        }
        return el;
      });
      return { ...state, elements };
    }

    case 'RESIZE_ELEMENT': {
      const elements = state.elements.map(el =>
        el.id === action.id
          ? { ...el, width: action.width, height: action.height }
          : el
      );
      const newState = { ...state, elements };
      return saveToHistory(newState, state);
    }

    case 'BRING_TO_FRONT': {
      const maxZIndex = Math.max(...state.elements.map(el => el.zIndex));
      const elements = state.elements.map(el =>
        el.id === action.id ? { ...el, zIndex: maxZIndex + 1 } : el
      );
      const newState = { ...state, elements };
      return saveToHistory(newState, state);
    }

    case 'SEND_TO_BACK': {
      const minZIndex = Math.min(...state.elements.map(el => el.zIndex));
      const elements = state.elements.map(el =>
        el.id === action.id ? { ...el, zIndex: minZIndex - 1 } : el
      );
      const newState = { ...state, elements };
      return saveToHistory(newState, state);
    }

    case 'DUPLICATE_ELEMENTS': {
      const elementsToDuplicate = state.elements.filter(el => action.ids.includes(el.id));
      const duplicatedElements = elementsToDuplicate.map(el => ({
        ...el,
        id: generateId(),
        x: el.x + 20,
        y: el.y + 20,
        zIndex: Math.max(...state.elements.map(e => e.zIndex)) + 1,
      }));
      const elements = [...state.elements, ...duplicatedElements];
      const selectedElementIds = duplicatedElements.map(el => el.id);
      const newState = { ...state, elements, selectedElementIds };
      return saveToHistory(newState, state);
    }

    case 'COPY_ELEMENTS': {
      const elementsToCopy = state.elements.filter(el => action.ids.includes(el.id));
      return { ...state, clipboard: elementsToCopy };
    }

    case 'PASTE_ELEMENTS': {
      const pastedElements = state.clipboard.map(el => ({
        ...el,
        id: generateId(),
        x: el.x + 20,
        y: el.y + 20,
        zIndex: Math.max(...state.elements.map(e => e.zIndex)) + 1,
      }));
      const elements = [...state.elements, ...pastedElements];
      const selectedElementIds = pastedElements.map(el => el.id);
      const newState = { ...state, elements, selectedElementIds };
      return saveToHistory(newState, state);
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const previousState = state.history[state.historyIndex - 1];
        return { ...previousState, historyIndex: state.historyIndex - 1 };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1];
        return { ...nextState, historyIndex: state.historyIndex + 1 };
      }
      return state;
    }

    case 'SET_CANVAS_SIZE': {
      const newState = {
        ...state,
        canvasWidth: action.width,
        canvasHeight: action.height,
      };
      return saveToHistory(newState, state);
    }

    case 'SET_ZOOM': {
      return { ...state, zoom: action.zoom };
    }

    case 'SET_PAN': {
      return { ...state, panX: action.panX, panY: action.panY };
    }

    case 'TOGGLE_GRID': {
      return { ...state, gridEnabled: !state.gridEnabled };
    }

    case 'TOGGLE_SNAP_TO_GRID': {
      return { ...state, snapToGrid: !state.snapToGrid };
    }

    case 'LOAD_PROJECT': {
      return {
        ...action.project.canvasState,
        history: [],
        historyIndex: -1,
      };
    }

    case 'RESET_CANVAS': {
      return initialState;
    }

    case 'RESET_AND_ADD_ELEMENTS': {
      const newState: CanvasState = {
        ...initialState,
        elements: action.elements,
        canvasWidth: action.width || initialState.canvasWidth,
        canvasHeight: action.height || initialState.canvasHeight,
      };
      return saveToHistory(newState, state);
    }

    default:
      return state;
  }
};

function saveToHistory(newState: CanvasState, currentState: CanvasState): CanvasState {
  const newHistory = currentState.history.slice(0, currentState.historyIndex + 1);
  newHistory.push(newState);
  
  // Limit history to 50 states
  if (newHistory.length > 50) {
    newHistory.shift();
  }

  return {
    ...newState,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function generateId(): string {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default canvasReducer;
