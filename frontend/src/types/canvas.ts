export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  style: ElementStyle;
}

export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  border?: string;
  borderRadius?: number;
  opacity?: number;
  padding?: number;
  margin?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  placeholder?: string;
  multiline?: boolean;
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface SectionElement extends BaseElement {
  type: 'section';
  title: string;
  elements: string[]; // References to other element IDs
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  size: number;
  color: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'line' | 'triangle';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export type ElementType = 'text' | 'heading' | 'section' | 'icon' | 'shape';
export type CanvasElement = TextElement | HeadingElement | SectionElement | IconElement | ShapeElement;

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  history: CanvasState[];
  historyIndex: number;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  panX: number;
  panY: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export interface CVProject {
  id: string;
  name: string;
  thumbnail?: string;
  lastModified: Date;
  createdAt: Date;
  canvasState: CanvasState;
  metadata: {
    version: string;
    template?: string;
    tags?: string[];
  };
}

export interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  originalX: number;
  originalY: number;
}

export interface ResizeState {
  isResizing: boolean;
  elementId: string | null;
  handle: string | null;
  startX: number;
  startY: number;
  originalWidth: number;
  originalHeight: number;
  originalX: number;
  originalY: number;
}

export interface CanvasToolbar {
  tool: 'select' | 'text' | 'heading' | 'icon' | 'shape' | 'rectangle' | 'circle' | 'line';
  isActive: boolean;
}

export interface CanvasContextType {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
  dragState: DragState;
  resizeState: ResizeState;
  toolbar: CanvasToolbar;
  setDragState: (state: DragState) => void;
  setResizeState: (state: ResizeState) => void;
  setToolbar: (toolbar: CanvasToolbar) => void;
}

export type CanvasAction =
  | { type: 'ADD_ELEMENT'; element: CanvasElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<CanvasElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENTS'; ids: string[] }
  | { type: 'MOVE_ELEMENTS'; ids: string[]; deltaX: number; deltaY: number }
  | { type: 'RESIZE_ELEMENT'; id: string; width: number; height: number }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SEND_TO_BACK'; id: string }
  | { type: 'DUPLICATE_ELEMENTS'; ids: string[] }
  | { type: 'COPY_ELEMENTS'; ids: string[] }
  | { type: 'PASTE_ELEMENTS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; panX: number; panY: number }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_SNAP_TO_GRID' }
  | { type: 'LOAD_PROJECT'; project: CVProject }
  | { type: 'RESET_CANVAS' };
