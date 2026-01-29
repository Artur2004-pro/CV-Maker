import React from 'react';
import { 
  MousePointer, Type, Square, Circle, Minus, FileText, 
  Undo, Redo, ZoomIn, ZoomOut, Grid, Lock, Unlock,
  Copy, Clipboard, Delete, BringToFront, SendToBack, Group, Ungroup
} from 'lucide-react';
import { ProButton } from '../../ui/ProButton';
import type { ToolbarTool } from '../../../types/template-creator';

interface TemplateToolbarProps {
  activeTool: string;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  onToolChange: (tool: string) => void;
  onZoomChange: (zoom: number) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export const TemplateToolbar: React.FC<TemplateToolbarProps> = ({
  activeTool,
  zoom,
  showGrid,
  snapToGrid,
  canUndo,
  canRedo,
  hasSelection,
  onToolChange,
  onZoomChange,
  onGridToggle,
  onSnapToggle,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDelete,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
}) => {
  const tools: ToolbarTool[] = [
    { id: 'select', name: 'Select', icon: 'mouse-pointer', type: 'select', shortcut: 'V' },
    { id: 'text', name: 'Text', icon: 'type', type: 'text', shortcut: 'T' },
    { id: 'rectangle', name: 'Rectangle', icon: 'square', type: 'shape', shortcut: 'R' },
    { id: 'circle', name: 'Circle', icon: 'circle', type: 'shape', shortcut: 'C' },
    { id: 'line', name: 'Line', icon: 'minus', type: 'line', shortcut: 'L' },
    { id: 'cv-field', name: 'CV Field', icon: 'file-text', type: 'cv-field', shortcut: 'F' },
  ];

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'select': return <MousePointer className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'rectangle': return <Square className="w-4 h-4" />;
      case 'circle': return <Circle className="w-4 h-4" />;
      case 'line': return <Minus className="w-4 h-4" />;
      case 'cv-field': return <FileText className="w-4 h-4" />;
      default: return <MousePointer className="w-4 h-4" />;
    }
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom * 0.8, 0.1));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 w-16">
      {/* Tools Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="space-y-1">
          {tools.map((tool) => (
            <ProButton
              key={tool.id}
              variant={activeTool === tool.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className="w-full justify-center"
              title={`${tool.name} (${tool.shortcut})`}
            >
              {getToolIcon(tool.id)}
            </ProButton>
          ))}
        </div>
      </div>

      {/* Edit Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="space-y-1">
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-full justify-center"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-full justify-center"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Copy (Ctrl+C)"
          >
            <Copy className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onPaste}
            className="w-full justify-center"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Delete (Del)"
          >
            <Delete className="w-4 h-4" />
          </ProButton>
        </div>
      </div>

      {/* Layer Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="space-y-1">
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onBringToFront}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Bring to Front"
          >
            <BringToFront className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onSendToBack}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Send to Back"
          >
            <SendToBack className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onGroup}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Group (Ctrl+G)"
          >
            <Group className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={onUngroup}
            disabled={!hasSelection}
            className="w-full justify-center"
            title="Ungroup (Ctrl+Shift+G)"
          >
            <Ungroup className="w-4 h-4" />
          </ProButton>
        </div>
      </div>

      {/* View Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="space-y-1">
          <ProButton
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="w-full justify-center"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </ProButton>
          <div className="text-xs text-center text-gray-600 py-1">
            {Math.round(zoom * 100)}%
          </div>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="w-full justify-center"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={handleZoomReset}
            className="w-full justify-center text-xs"
            title="Reset Zoom"
          >
            1:1
          </ProButton>
        </div>
      </div>

      {/* Grid Section */}
      <div className="p-2">
        <div className="space-y-1">
          <ProButton
            variant={showGrid ? 'primary' : 'ghost'}
            size="sm"
            onClick={onGridToggle}
            className="w-full justify-center"
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </ProButton>
          <ProButton
            variant={snapToGrid ? 'primary' : 'ghost'}
            size="sm"
            onClick={onSnapToggle}
            className="w-full justify-center"
            title="Snap to Grid"
          >
            {snapToGrid ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </ProButton>
        </div>
      </div>
    </div>
  );
};
