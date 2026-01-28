/**
 * Обновленный CanvasProperties для работы с новой архитектурой редактора
 */

import React from 'react';
import { useEditor } from '../../editor/core/EditorContext';
import { EditorStateHelpers } from '../../editor/core/EditorState';
import { UpdateElementCommand } from '../../editor/commands';
import { CanvasElement } from '../../types/canvas';

const CanvasPropertiesNew: React.FC = () => {
  const { state, executeCommand } = useEditor();

  const selectedElements = EditorStateHelpers.getSelectedElements(state);

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const element = EditorStateHelpers.getElement(state, id);
    if (!element) return;

    const command = new UpdateElementCommand(id, updates, element);
    executeCommand(command);
  };

  const renderElementProperties = (element: CanvasElement) => {
    const commonProperties = (
      <>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => updateElement(element.id, { x: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => updateElement(element.id, { y: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">Width</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => updateElement(element.id, { width: parseInt(e.target.value) || 50 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Height</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => updateElement(element.id, { height: parseInt(e.target.value) || 50 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={element.rotation}
            onChange={(e) => updateElement(element.id, { rotation: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">{element.rotation}°</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.style.opacity || 1}
            onChange={(e) => updateElement(element.id, {
              style: { ...element.style, opacity: parseFloat(e.target.value) }
            })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">{Math.round((element.style.opacity || 1) * 100)}%</div>
        </div>
      </>
    );

    switch (element.type) {
      case 'text':
      case 'heading':
        return (
          <>
            {commonProperties}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={(element as any).content || ''}
                onChange={(e) => updateElement(element.id, { content: e.target.value } as any)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Font</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">Size</label>
                  <input
                    type="number"
                    value={element.style.fontSize || 14}
                    onChange={(e) => updateElement(element.id, {
                      style: { ...element.style, fontSize: parseInt(e.target.value) || 14 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Weight</label>
                  <select
                    value={element.style.fontWeight || 'normal'}
                    onChange={(e) => updateElement(element.id, {
                      style: { ...element.style, fontWeight: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={element.style.color || '#000000'}
                onChange={(e) => updateElement(element.id, {
                  style: { ...element.style, color: e.target.value }
                })}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Text Align</label>
              <select
                value={element.style.textAlign || 'left'}
                onChange={(e) => updateElement(element.id, {
                  style: { ...element.style, textAlign: e.target.value as any }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case 'icon':
        return (
          <>
            {commonProperties}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <select
                value={(element as any).iconName || 'Star'}
                onChange={(e) => updateElement(element.id, { iconName: e.target.value } as any)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="Star">Star</option>
                <option value="Heart">Heart</option>
                <option value="Award">Award</option>
                <option value="Trophy">Trophy</option>
                <option value="Crown">Crown</option>
                <option value="Gem">Gem</option>
                <option value="Sparkle">Sparkle</option>
                <option value="Zap">Zap</option>
                <option value="Flame">Flame</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <input
                type="number"
                value={(element as any).size || 32}
                onChange={(e) => updateElement(element.id, { size: parseInt(e.target.value) || 32 } as any)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={(element as any).color || '#fbbf24'}
                onChange={(e) => updateElement(element.id, { color: e.target.value } as any)}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </>
        );

      case 'shape':
        return (
          <>
            {commonProperties}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Shape Type</label>
              <select
                value={(element as any).shapeType || 'rectangle'}
                onChange={(e) => updateElement(element.id, { shapeType: e.target.value as any } as any)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
                <option value="line">Line</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fill</label>
              <input
                type="color"
                value={(element as any).fill || '#e5e7eb'}
                onChange={(e) => updateElement(element.id, { fill: e.target.value } as any)}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stroke</label>
              <input
                type="color"
                value={(element as any).stroke || '#9ca3af'}
                onChange={(e) => updateElement(element.id, { stroke: e.target.value } as any)}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stroke Width</label>
              <input
                type="number"
                value={(element as any).strokeWidth || 2}
                onChange={(e) => updateElement(element.id, { strokeWidth: parseInt(e.target.value) || 2 } as any)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </>
        );

      default:
        return commonProperties;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>

      {selectedElements.length === 0 ? (
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      ) : selectedElements.length === 1 ? (
        <div className="space-y-6">
          {renderElementProperties(selectedElements[0])}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Advanced</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedElements[0].locked}
                  onChange={(e) => updateElement(selectedElements[0].id, { locked: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Locked</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedElements[0].visible}
                  onChange={(e) => updateElement(selectedElements[0].id, { visible: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {selectedElements.length} elements selected
          </p>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Multi-select Actions</label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  selectedElements.forEach(el => {
                    updateElement(el.id, { locked: !el.locked });
                  });
                }}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Toggle Lock
              </button>
              <button
                onClick={() => {
                  selectedElements.forEach(el => {
                    updateElement(el.id, { visible: !el.visible });
                  });
                }}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Toggle Visibility
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasPropertiesNew;

