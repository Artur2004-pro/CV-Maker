/**
 * Интегрированный Canvas Editor
 * Объединяет новый редактор с существующими компонентами (Toolbar, Properties, SaveLoad)
 */

import React from 'react';
import { EditorProvider } from '../../editor/core/EditorContext';
import NewCanvasEditor from '../../editor/rendering/NewCanvasEditor';
import CanvasToolbarNew from './CanvasToolbarNew';
import CanvasPropertiesNew from './CanvasPropertiesNew';
import CanvasSaveLoad from './CanvasSaveLoad';
import { useCVCanvas } from '../../contexts/CVCanvasContext';

interface IntegratedCanvasEditorProps {
  onElementUpdate?: (id: string, updates: any) => void;
}

/**
 * Внутренний компонент, который использует CVCanvas context
 */
const IntegratedCanvasEditorContent: React.FC<IntegratedCanvasEditorProps> = ({
  onElementUpdate,
}) => {
  let updateCVFromElement: ((elementId: string, newContent: string) => void) | undefined;
  
  try {
    const cvCanvas = useCVCanvas();
    updateCVFromElement = cvCanvas.updateCVFromElement;
  } catch (e) {
    // CVCanvasContext не доступен, это нормально
  }

  return (
    <div className="canvas-editor flex h-screen bg-gray-100">
      {/* Toolbar */}
      <CanvasToolbarNew />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        <NewCanvasEditor
          onElementUpdate={onElementUpdate}
          onCVUpdate={updateCVFromElement}
        />
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <CanvasSaveLoad />
        <CanvasPropertiesNew />
      </div>
    </div>
  );
};

/**
 * Главный компонент с EditorProvider
 */
const IntegratedCanvasEditor: React.FC<IntegratedCanvasEditorProps> = (props) => {
  return (
    <EditorProvider>
      <IntegratedCanvasEditorContent {...props} />
    </EditorProvider>
  );
};

export default IntegratedCanvasEditor;

