/**
 * Обновленный CanvasToolbar для работы с новой архитектурой редактора
 */

import React, { useState } from 'react';
import { useEditor } from '../../editor/core/EditorContext';
import { EditorStateHelpers } from '../../editor/core/EditorState';
import { AddElementCommand, ChangeZIndexCommand, DuplicateElementsCommand, DeleteElementCommand } from '../../editor/commands';
import { ProfessionalIcons } from '../ui/IconSystem';
import { CanvasElement } from '../../types/canvas';
import { nanoid } from 'nanoid';

const CanvasToolbarNew: React.FC = () => {
  const { state, executeCommand, selectElements } = useEditor();
  const [activeTool, setActiveTool] = useState<string>('select');

  const tools = [
    { id: 'select', icon: ProfessionalIcons.ArrowRightIcon, label: 'Select' },
    { id: 'text', icon: ProfessionalIcons.FileTextIcon, label: 'Text' },
    { id: 'heading', icon: ProfessionalIcons.EditIcon, label: 'Heading' },
    { id: 'icon', icon: ProfessionalIcons.StarIcon, label: 'Icon' },
    { id: 'rectangle', icon: ProfessionalIcons.SquareIcon, label: 'Rectangle' },
    { id: 'circle', icon: ProfessionalIcons.CircleIcon, label: 'Circle' },
    { id: 'line', icon: ProfessionalIcons.MinusIcon, label: 'Line' },
  ];

  const addElement = (type: string) => {
    const elements = EditorStateHelpers.getElementsArray(state);
    const maxZIndex = Math.max(...elements.map(el => el.zIndex), 0);
    
    const id = `element_${nanoid()}`;
    const baseElement: Partial<CanvasElement> = {
      id,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: maxZIndex + 1,
      locked: false,
      visible: true,
      style: {
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left' as const,
        border: 'none',
        borderRadius: 0,
        opacity: 1,
        padding: 8,
        margin: 0,
      },
    };

    let element: CanvasElement;

    switch (type) {
      case 'text':
        element = {
          ...baseElement,
          type: 'text',
          content: 'Click to edit text',
          placeholder: 'Enter your text here',
          multiline: false,
        } as CanvasElement;
        break;

      case 'heading':
        element = {
          ...baseElement,
          type: 'heading',
          content: 'Heading',
          level: 2,
          style: {
            ...baseElement.style!,
            fontSize: 24,
            fontWeight: 'bold',
          },
        } as CanvasElement;
        break;

      case 'icon':
        element = {
          ...baseElement,
          type: 'icon',
          iconName: 'Star',
          size: 32,
          color: '#fbbf24',
          width: 64,
          height: 64,
        } as CanvasElement;
        break;

      case 'rectangle':
        element = {
          ...baseElement,
          type: 'shape',
          shapeType: 'rectangle',
          fill: '#e5e7eb',
          stroke: '#9ca3af',
          strokeWidth: 2,
          width: 150,
          height: 100,
        } as CanvasElement;
        break;

      case 'circle':
        element = {
          ...baseElement,
          type: 'shape',
          shapeType: 'circle',
          fill: '#e5e7eb',
          stroke: '#9ca3af',
          strokeWidth: 2,
          width: 100,
          height: 100,
        } as CanvasElement;
        break;

      case 'line':
        element = {
          ...baseElement,
          type: 'shape',
          shapeType: 'line',
          fill: 'transparent',
          stroke: '#9ca3af',
          strokeWidth: 2,
          height: 2,
          width: 200,
        } as CanvasElement;
        break;

      default:
        return;
    }

    const command = new AddElementCommand(element);
    executeCommand(command);
    setActiveTool('select');
  };

  const selectedIds = Array.from(state.selectedIds);

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => {
            if (tool.id === 'select') {
              setActiveTool('select');
            } else {
              addElement(tool.id);
            }
          }}
          className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors ${
            activeTool === tool.id
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title={tool.label}
        >
          <tool.icon size="sm" />
          <span className="text-xs mt-1">{tool.label}</span>
        </button>
      ))}

      <div className="border-t border-gray-200 w-full mt-4 pt-4">
        <button
          onClick={() => {
            if (selectedIds.length > 0) {
              const command = new ChangeZIndexCommand(selectedIds[0], 'front');
              executeCommand(command);
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Bring to Front"
          disabled={selectedIds.length === 0}
        >
          <ProfessionalIcons.ChevronUpIcon size="sm" />
          <span className="text-xs mt-1">Front</span>
        </button>

        <button
          onClick={() => {
            if (selectedIds.length > 0) {
              const command = new ChangeZIndexCommand(selectedIds[0], 'back');
              executeCommand(command);
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Send to Back"
          disabled={selectedIds.length === 0}
        >
          <ProfessionalIcons.ChevronDownIcon size="sm" />
          <span className="text-xs mt-1">Back</span>
        </button>

        <button
          onClick={() => {
            if (selectedIds.length > 0) {
              const command = new DuplicateElementsCommand(selectedIds);
              executeCommand(command);
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Duplicate"
          disabled={selectedIds.length === 0}
        >
          <ProfessionalIcons.CopyIcon size="sm" />
          <span className="text-xs mt-1">Copy</span>
        </button>

        <button
          onClick={() => {
            selectedIds.forEach(id => {
              const command = new DeleteElementCommand(id);
              executeCommand(command);
            });
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-red-100 text-red-700"
          title="Delete"
          disabled={selectedIds.length === 0}
        >
          <ProfessionalIcons.TrashIcon size="sm" />
          <span className="text-xs mt-1">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbarNew;

