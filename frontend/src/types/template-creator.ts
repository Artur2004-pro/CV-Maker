// Template Creator Types
export interface TemplateElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'line' | 'rectangle' | 'circle' | 'cv-field';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  name: string;
  data: ElementData;
  style: ElementStyle;
}

export interface ElementData {
  // Text elements
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // CV Field elements
  fieldType?: 'personal-info' | 'experience' | 'education' | 'skills' | 'summary';
  fieldKey?: string;
  placeholder?: string;
  
  // Image elements
  src?: string;
  alt?: string;
  
  // Shape elements
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  
  // Line elements
  x2?: number;
  y2?: number;
}

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
}

export interface TemplateCanvas {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: TemplateElement[];
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  created: string;
  modified: string;
}

export interface TemplateCreatorState {
  canvas: TemplateCanvas;
  selectedElements: string[];
  clipboard: TemplateElement[];
  history: TemplateCanvas[];
  historyIndex: number;
  isDirty: boolean;
  zoom: number;
  panX: number;
  panY: number;
  tool: 'select' | 'text' | 'shape' | 'line' | 'cv-field';
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  isResizing: boolean;
  resizeHandle: string | null;
}

export interface ToolbarTool {
  id: string;
  name: string;
  icon: string;
  type: 'select' | 'text' | 'shape' | 'line' | 'cv-field';
  shortcut?: string;
}

export interface PropertyPanelSection {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface CVFieldMapping {
  [key: string]: {
    label: string;
    type: 'text' | 'multiline' | 'date' | 'list';
    required: boolean;
    placeholder?: string;
  };
}

// Professional template presets
export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'professional';
  canvas: TemplateCanvas;
  isPremium: boolean;
}

// Canvas events
export interface CanvasEvent {
  type: 'click' | 'mousedown' | 'mousemove' | 'mouseup' | 'keydown' | 'keyup';
  x: number;
  y: number;
  target?: string;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
  };
}

// Export options
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json';
  quality: number;
  scale: number;
  backgroundColor?: string;
}
