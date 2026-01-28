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

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // Image source URL or data URL
  alt?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

// CV Field binding metadata
export interface CVBinding {
  fieldType: 'personal-info' | 'experience' | 'education' | 'skills' | 'summary';
  fieldKey: string; // e.g., 'fullName', 'email', 'summary', 'experience.0.company'
  index?: number; // For array fields like experience[0]
}

// CV Field element - binds to CVData
export interface CVFieldElement extends BaseElement {
  type: 'cv-field';
  content: string; // Resolved content from CVData
  placeholder?: string;
  multiline?: boolean;
  cvBinding: CVBinding; // Metadata for CVData binding
}

export type ElementType = 'text' | 'heading' | 'section' | 'icon' | 'shape' | 'cv-field' | 'image';
export type CanvasElement = TextElement | HeadingElement | SectionElement | IconElement | ShapeElement | CVFieldElement | ImageElement;

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
  tool: 'select' | 'text' | 'heading' | 'icon' | 'shape' | 'rectangle' | 'circle' | 'line' | 'cv-field';
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
  | { type: 'RESET_CANVAS' }
  | { type: 'RESET_AND_ADD_ELEMENTS'; elements: CanvasElement[]; width?: number; height?: number };
