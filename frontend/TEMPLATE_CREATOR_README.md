# Professional Canvas-Based Template Creator

A comprehensive, professional-grade template creator system built with React, TypeScript, and HTML5 Canvas. This system allows users to create, edit, and manage CV templates with advanced design tools and real-time canvas editing capabilities.

## 🎯 Features Overview

### 🎨 Canvas Editor
- **Real-time Canvas Rendering** - High-performance HTML5 Canvas with zoom and pan
- **Drag-and-Drop Positioning** - Intuitive element manipulation with visual feedback
- **Grid System** - Optional grid with snap-to-grid functionality for precise alignment
- **Multi-Selection** - Select multiple elements for batch operations
- **Z-Index Management** - Control element layering with bring-to-front/send-to-back

### 🛠️ Advanced Tools
- **Selection Tool** - Move, resize, and manipulate elements
- **Text Tool** - Add and style text elements with full typography control
- **Shape Tools** - Create rectangles, circles, and custom shapes
- **Line Tool** - Draw lines and connectors
- **CV Field Tool** - Place dynamic data fields that populate with user information

### 🎨 Styling Capabilities
- **Typography Control** - Font family, size, weight, alignment, and color
- **Element Styling** - Background colors, borders, opacity, shadows
- **Responsive Design** - Elements adapt to different canvas sizes
- **Professional Presets** - Pre-built professional template layouts

### 💾 Data Management
- **Auto-Save** - Automatic history tracking with undo/redo functionality
- **Template Export** - Export templates as JSON for sharing and backup
- **Template Import** - Import existing templates and continue editing
- **Backend Integration** - Save templates to server with API integration

### ⚡ Performance
- **Optimized Rendering** - Efficient canvas drawing with minimal re-renders
- **Smart Updates** - Only re-render changed elements
- **Memory Management** - Proper cleanup and resource management
- **Large Canvas Support** - Handle complex templates with many elements

## 🏗️ Architecture

### Core Components

#### 1. TemplateCanvas
The main canvas component responsible for:
- Rendering elements on HTML5 Canvas
- Handling mouse events for selection and manipulation
- Managing zoom, pan, and grid display
- Providing visual feedback for interactions

#### 2. TemplateToolbar
Professional toolbar with:
- Tool selection (select, text, shapes, lines, CV fields)
- Edit operations (undo, redo, copy, paste, delete)
- Layer controls (bring-to-front, send-to-back, group, ungroup)
- View controls (zoom in/out, grid toggle, snap toggle)

#### 3. PropertiesPanel
Context-sensitive properties panel for:
- Position and size controls
- Text styling options
- Element appearance settings
- CV field configuration

#### 4. useTemplateCreator Hook
Central state management hook providing:
- Canvas state management
- Element CRUD operations
- History tracking for undo/redo
- Import/export functionality
- Keyboard shortcuts handling

### Data Models

#### TemplateElement
```typescript
interface TemplateElement {
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
```

#### TemplateCanvas
```typescript
interface TemplateCanvas {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: TemplateElement[];
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  created: string;
  modified: string;
}
```

## �� Getting Started

### Installation
The template creator is integrated into the main CV Maker frontend. Ensure you have all dependencies installed:

```bash
npm install
```

### Usage

#### 1. Access the Template Creator
Navigate to `/templates` and click "Create Template" or go directly to `/template-creator`.

#### 2. Basic Workflow
1. **Select a Tool** - Choose from the toolbar (select, text, shapes, etc.)
2. **Add Elements** - Click on the canvas to place elements
3. **Edit Properties** - Use the properties panel to customize elements
4. **Arrange Layout** - Drag elements to position them
5. **Save Template** - Export or save your creation

#### 3. Keyboard Shortcuts
- **V** - Selection tool
- **T** - Text tool
- **R** - Rectangle tool
- **C** - Circle tool
- **L** - Line tool
- **F** - CV field tool
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+C** - Copy
- **Ctrl+V** - Paste
- **Ctrl+A** - Select all
- **Ctrl+S** - Save
- **Delete** - Delete selected elements

## 🎨 Element Types

### Text Elements
- **Dynamic Text** - Editable text with full typography control
- **Font Styling** - Family, size, weight, color, alignment
- **Multi-line Support** - Handle paragraphs and line breaks

### Shape Elements
- **Rectangles** - Backgrounds, containers, borders
- **Circles** - Avatars, badges, decorative elements
- **Lines** - Dividers, connectors, underlines
- **Custom Styling** - Colors, borders, opacity, shadows

### CV Field Elements
- **Dynamic Data Binding** - Automatically populate with user data
- **Field Types**:
  - Personal Info (name, email, phone, location)
  - Experience (company, position, dates, description)
  - Education (school, degree, dates)
  - Skills (technical and soft skills)
  - Summary (professional overview)
- **Placeholders** - Custom placeholder text for empty fields

### Image Elements
- **Profile Photos** - User avatar placement
- **Logos** - Company or organization logos
- **Decorative Images** - Background patterns and graphics

## 🔧 Advanced Features

### Grid System
- **Customizable Grid Size** - Adjust grid spacing for precision
- **Snap-to-Grid** - Automatic alignment for perfect layouts
- **Visual Feedback** - Grid display toggle for reference

### History Management
- **Unlimited Undo/Redo** - Full history tracking (limited to 50 items)
- **Auto-Save** - Automatic state persistence
- **Branching** - Non-linear editing history

### Template Presets
Professional pre-built templates:
- **Modern Professional** - Clean corporate design
- **Creative Designer** - Artistic layout for creative roles
- **Classic Executive** - Traditional executive format
- **Minimal Developer** - Clean tech-focused design

## 📱 Responsive Design

### Canvas Adaptation
- **A4 Standard** - Default 794×1123px canvas (A4 at 96 DPI)
- **Custom Sizes** - Support for custom canvas dimensions
- **Print Optimization** - Pixel-perfect rendering for PDF export

### Element Scaling
- **Proportional Scaling** - Elements maintain relationships
- **Text Readability** - Automatic font size adjustments
- **Layout Preservation** - Design integrity across sizes

## 🔌 API Integration

### Backend Endpoints
```typescript
// Save template
POST /api/templates
{
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  templateData: TemplateCanvas;
}

// Get templates
GET /api/templates

// Get template by ID
GET /api/templates/:id
```

### Data Flow
1. **Client State** - Real-time canvas editing
2. **API Sync** - Save/load from backend
3. **Export** - Generate JSON for sharing
4. **Import** - Load external templates

## 🎯 Use Cases

### 1. Professional CV Templates
- Create industry-specific templates
- Design branded company templates
- Build personal signature styles

### 2. Custom Design Services
- Offer template design as a service
- Create client-specific templates
- Maintain template libraries

### 3. Educational Purposes
- Teach design principles
- Demonstrate layout concepts
- Practice typography and composition

## 🔍 Troubleshooting

### Common Issues

#### Canvas Not Rendering
- Check canvas dimensions are set correctly
- Verify elements have valid positions and sizes
- Ensure canvas ref is properly mounted

#### Performance Issues
- Limit number of elements on complex canvases
- Use efficient event handling
- Optimize render cycles

#### Import/Export Problems
- Validate JSON structure before importing
- Check for required fields in template data
- Ensure proper data serialization

### Debug Mode
Enable debug logging:
```typescript
const DEBUG = true;
if (DEBUG) console.log('Canvas state:', state);
```

## 🚀 Future Enhancements

### Planned Features
- **Advanced Shape Tools** - Polygons, stars, custom paths
- **Image Filters** - Grayscale, blur, brightness adjustments
- **Template Marketplace** - Share and sell templates
- **Collaboration** - Real-time collaborative editing
- **AI Assistance** - Smart layout suggestions
- **Advanced Export** - SVG, PNG, PDF with high DPI

### Performance Optimizations
- **WebGL Rendering** - Hardware-accelerated canvas
- **Virtual Scrolling** - Handle large element counts
- **Worker Threads** - Background processing
- **Incremental Rendering** - Progressive updates

## 📚 Technical Documentation

### Canvas Rendering Pipeline
1. **Clear Canvas** - Reset drawing surface
2. **Apply Transformations** - Zoom, pan, rotation
3. **Draw Grid** - Optional grid overlay
4. **Render Elements** - Sort by z-index, draw each element
5. **Draw Selection** - Highlight selected elements
6. **Draw UI** - Handles, borders, controls

### Event Handling
1. **Coordinate Conversion** - Screen to canvas coordinates
2. **Hit Testing** - Element selection detection
3. **Drag Operations** - Move and resize handling
4. **Keyboard Events** - Shortcuts and commands
5. **Touch Support** - Mobile interaction (future)

### State Management
1. **Immutable Updates** - Prevent side effects
2. **History Tracking** - Undo/redo implementation
3. **Performance** - Efficient re-rendering
4. **Persistence** - Auto-save and recovery

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies
3. Run development server
4. Create feature branch
5. Submit pull request

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation
- Unit tests for critical functions

### Testing Strategy
- Unit tests for utility functions
- Integration tests for canvas operations
- E2E tests for complete workflows
- Performance benchmarks

## 📄 License

This template creator system is part of the CV Maker project and follows the same licensing terms.

## 🙏 Acknowledgments

Built with modern web technologies and inspired by professional design tools. Special thanks to the React, TypeScript, and Canvas API communities.
