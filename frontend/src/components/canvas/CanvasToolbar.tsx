import React from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import { ProfessionalIcons } from '../ui/IconSystem';

const CanvasToolbar: React.FC = () => {
  const { state, dispatch, toolbar, setToolbar } = useCanvas();

  const tools = [
    { id: 'select', icon: ProfessionalIcons.ArrowRightIcon, label: 'Select' },
    { id: 'text', icon: ProfessionalIcons.FileTextIcon, label: 'Text' },
    { id: 'heading', icon: ProfessionalIcons.EditIcon, label: 'Heading' },
    { id: 'icon', icon: ProfessionalIcons.StarIcon, label: 'Icon' },
    { id: 'rectangle', icon: ProfessionalIcons.SquareIcon, label: 'Rectangle' },
    { id: 'circle', icon: ProfessionalIcons.CircleIcon, label: 'Circle' },
    { id: 'line', icon: ProfessionalIcons.MinusIcon, label: 'Line' },
  ];

  const handleToolClick = (toolId: string) => {
    setToolbar({ tool: toolId as any, isActive: true });
  };

  const addElement = (type: string, options: any = {}) => {
    const id = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const baseElement = {
      id,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: state.elements.length,
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

    let element;

    switch (type) {
      case 'text':
        element = {
          ...baseElement,
          type: 'text',
          content: 'Click to edit text',
          placeholder: 'Enter your text here',
          multiline: false,
        };
        break;

      case 'heading':
        element = {
          ...baseElement,
          type: 'heading',
          content: 'Heading',
          level: 2 as const,
          style: {
            ...baseElement.style,
            fontSize: 24,
            fontWeight: 'bold',
          },
        };
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
        };
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
        };
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
        };
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
        };
        break;

      default:
        return;
    }

    dispatch({ type: 'ADD_ELEMENT', element });
    setToolbar({ tool: 'select', isActive: false });
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => {
            if (tool.id === 'select') {
              setToolbar({ tool: 'select', isActive: true });
            } else {
              addElement(tool.id);
            }
          }}
          className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors ${
            toolbar.tool === tool.id && toolbar.isActive
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
            if (state.selectedElementIds.length > 0) {
              dispatch({ type: 'BRING_TO_FRONT', id: state.selectedElementIds[0] });
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Bring to Front"
          disabled={state.selectedElementIds.length === 0}
        >
          <ProfessionalIcons.ChevronUpIcon size="sm" />
          <span className="text-xs mt-1">Front</span>
        </button>

        <button
          onClick={() => {
            if (state.selectedElementIds.length > 0) {
              dispatch({ type: 'SEND_TO_BACK', id: state.selectedElementIds[0] });
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Send to Back"
          disabled={state.selectedElementIds.length === 0}
        >
          <ProfessionalIcons.ChevronDownIcon size="sm" />
          <span className="text-xs mt-1">Back</span>
        </button>

        <button
          onClick={() => {
            if (state.selectedElementIds.length > 0) {
              dispatch({ type: 'DUPLICATE_ELEMENTS', ids: state.selectedElementIds });
            }
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
          title="Duplicate"
          disabled={state.selectedElementIds.length === 0}
        >
          <ProfessionalIcons.CopyIcon size="sm" />
          <span className="text-xs mt-1">Copy</span>
        </button>

        <button
          onClick={() => {
            state.selectedElementIds.forEach(id => {
              dispatch({ type: 'DELETE_ELEMENT', id });
            });
          }}
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-red-100 text-red-700"
          title="Delete"
          disabled={state.selectedElementIds.length === 0}
        >
          <ProfessionalIcons.TrashIcon size="sm" />
          <span className="text-xs mt-1">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
