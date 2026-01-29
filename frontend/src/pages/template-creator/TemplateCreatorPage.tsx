import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Download, Upload, Eye, Settings, HelpCircle,
  FileText, Square, Circle, Minus, Type, Grid
} from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProCard } from '../../components/ui/ProCard';
import { TemplateCanvas } from '../../components/template-creator/canvas/TemplateCanvas';
import { TemplateToolbar } from '../../components/template-creator/toolbar/TemplateToolbar';
import { PropertiesPanel } from '../../components/template-creator/properties-panel/PropertiesPanel';
import { useTemplateCreator } from '../../hooks/useTemplateCreator';
import { apiClient } from '../../services/apiClient';
import toast from 'react-hot-toast';

export const TemplateCreatorPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    updateCanvas,
    updateElement,
    updateElements,
    deleteElements,
    selectElements,
    copyElements,
    pasteElements,
    undo,
    redo,
    bringToFront,
    sendToBack,
    setZoom,
    setPan,
    setTool,
    toggleGrid,
    toggleSnap,
    handleCanvasEvent,
    exportTemplate,
    importTemplate,
    resetCanvas,
    selectedElements,
    canUndo,
    canRedo,
    hasSelection,
    hasClipboard,
  } = useTemplateCreator();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Ignore typing in inputs
      }

      const { ctrlKey, shiftKey, key } = e;
      
      // Tool shortcuts
      if (!ctrlKey && !shiftKey) {
        switch (key.toLowerCase()) {
          case 'v':
            setTool('select');
            break;
          case 't':
            setTool('text');
            break;
          case 'r':
            setTool('shape');
            break;
          case 'c':
            setTool('shape');
            break;
          case 'l':
            setTool('line');
            break;
          case 'f':
            setTool('cv-field');
            break;
          case 'delete':
          case 'backspace':
            if (hasSelection) {
              deleteElements(state.selectedElements);
            }
            break;
        }
      }
      
      // Edit shortcuts
      if (ctrlKey) {
        switch (key.toLowerCase()) {
          case 'z':
            if (shiftKey) {
              redo();
            } else {
              undo();
            }
            e.preventDefault();
            break;
          case 'y':
            redo();
            e.preventDefault();
            break;
          case 'c':
            if (hasSelection) {
              copyElements();
            }
            e.preventDefault();
            break;
          case 'v':
            if (hasClipboard) {
              pasteElements();
            }
            e.preventDefault();
            break;
          case 'a':
            selectElements(state.canvas.elements.map(el => el.id));
            e.preventDefault();
            break;
          case 's':
            handleSave();
            e.preventDefault();
            break;
        }
      }
      
      // View shortcuts
      if (ctrlKey && !shiftKey) {
        switch (key.toLowerCase()) {
          case '0':
            setZoom(1);
            e.preventDefault();
            break;
          case '+':
          case '=':
            setZoom(Math.min(state.zoom * 1.2, 5));
            e.preventDefault();
            break;
          case '-':
            setZoom(Math.max(state.zoom * 0.8, 0.1));
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, hasSelection, hasClipboard, selectedElements, setTool, deleteElements, copyElements, pasteElements, undo, redo, selectElements, setZoom]);

  const handleSave = useCallback(async () => {
    try {
      const templateData = exportTemplate({ format: 'json', quality: 1, scale: 1 });
      
      // Save to backend
      const response = await apiClient.post('/templates', {
        name: state.canvas.name,
        description: `Custom template created on ${new Date().toLocaleDateString()}`,
        category: 'custom',
        isPremium: false,
        templateData: JSON.parse(templateData as string),
      });
      
      if (response.success) {
        toast.success('Template saved successfully!');
        navigate('/templates');
      } else {
        throw new Error(response.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save template');
    }
  }, [state.canvas, exportTemplate, navigate]);

  const handleExport = useCallback((format: 'json' | 'png' | 'svg' | 'pdf') => {
    try {
      const data = exportTemplate({ format, quality: 1, scale: 1 });
      
      if (format === 'json') {
        const blob = new Blob([data as string], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${state.canvas.name.replace(/\s+/g, '_')}_template.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Template exported successfully!');
      } else {
        toast(`${format.toUpperCase()} export coming soon!`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export template');
    }
  }, [state.canvas.name, exportTemplate]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (content && importTemplate(content)) {
            toast.success('Template imported successfully!');
          } else {
            toast.error('Failed to import template');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [importTemplate]);

  const handlePreview = useCallback(() => {
    toast('Preview feature coming soon!');
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the canvas? All changes will be lost.')) {
      resetCanvas();
      toast.success('Canvas reset successfully!');
    }
  }, [resetCanvas]);

  const handleCanvasClick = useCallback((event: any) => {
    handleCanvasEvent(event);
  }, [handleCanvasEvent]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ProButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/templates')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </ProButton>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Template Creator</h1>
              <p className="text-sm text-gray-500">{state.canvas.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ProButton
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </ProButton>
            <ProButton
              variant="outline"
              size="sm"
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </ProButton>
            <ProButton
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </ProButton>
            <ProButton
              onClick={handleSave}
              disabled={!state.isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </ProButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <TemplateToolbar
          activeTool={state.tool}
          zoom={state.zoom}
          showGrid={state.canvas.showGrid}
          snapToGrid={state.canvas.snapToGrid}
          canUndo={canUndo}
          canRedo={canRedo}
          hasSelection={hasSelection}
          onToolChange={setTool}
          onZoomChange={setZoom}
          onGridToggle={toggleGrid}
          onSnapToggle={toggleSnap}
          onUndo={undo}
          onRedo={redo}
          onCopy={copyElements}
          onPaste={pasteElements}
          onDelete={() => deleteElements(state.selectedElements)}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onGroup={() => toast('Grouping coming soon!')}
          onUngroup={() => toast('Ungrouping coming soon!')}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
          <ProCard className="shadow-2xl">
            <TemplateCanvas
              canvas={state.canvas}
              selectedElements={state.selectedElements}
              zoom={state.zoom}
              panX={state.panX}
              panY={state.panY}
              showGrid={state.canvas.showGrid}
              snapToGrid={state.canvas.snapToGrid}
              onElementSelect={selectElements}
              onElementUpdate={updateElement}
              onCanvasUpdate={updateCanvas}
              onEvent={handleCanvasClick}
            />
          </ProCard>
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedElements={selectedElements}
          onElementsUpdate={updateElements}
          onElementDelete={deleteElements}
        />
      </div>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Canvas: {state.canvas.width} × {state.canvas.height}px</span>
            <span>Elements: {state.canvas.elements.length}</span>
            <span>Selected: {state.selectedElements.length}</span>
            <span>Zoom: {Math.round(state.zoom * 100)}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Grid: {state.canvas.showGrid ? 'On' : 'Off'}</span>
            <span>Snap: {state.canvas.snapToGrid ? 'On' : 'Off'}</span>
            {state.isDirty && <span className="text-orange-600 font-medium">Unsaved</span>}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateCreatorPage;
