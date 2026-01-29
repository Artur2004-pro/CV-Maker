import React, { useState } from 'react';
import { 
  Palette, Type, Layout, Settings, ChevronDown, ChevronRight,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react';
import { ProButton } from '../../ui/ProButton';
import { ProInput } from '../../ui/ProInput';
import type { TemplateElement } from '../../../types/template-creator';

interface PropertiesPanelProps {
  selectedElements: TemplateElement[];
  onElementsUpdate: (elements: TemplateElement[]) => void;
  onElementDelete: (elementIds: string[]) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElements,
  onElementsUpdate,
  onElementDelete,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['position', 'style']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateSelectedElements = (updates: Partial<TemplateElement>) => {
    const updatedElements = selectedElements.map(element => ({
      ...element,
      ...updates,
    }));
    onElementsUpdate(updatedElements);
  };

  const updateElementData = (dataUpdates: any) => {
    const updatedElements = selectedElements.map(element => ({
      ...element,
      data: { ...element.data, ...dataUpdates },
    }));
    onElementsUpdate(updatedElements);
  };

  const updateElementStyle = (styleUpdates: any) => {
    const updatedElements = selectedElements.map(element => ({
      ...element,
      style: { ...element.style, ...styleUpdates },
    }));
    onElementsUpdate(updatedElements);
  };

  const getCommonValue = (property: string) => {
    if (selectedElements.length === 0) return '';
    const values = selectedElements.map(el => {
      if (property.includes('.')) {
        const [obj, prop] = property.split('.');
        return el[obj as keyof TemplateElement]?.[prop as string] || '';
      }
      return el[property as keyof TemplateElement] || '';
    });
    return values.every(v => v === values[0]) ? values[0] : '';
  };

  const hasCommonType = (type: string) => {
    return selectedElements.length > 0 && selectedElements.every(el => el.type === type);
  };

  const sections = [
    {
      id: 'position',
      title: 'Position & Size',
      icon: <Layout className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
              <ProInput
                type="number"
                value={getCommonValue('x')}
                onChange={(e) => updateSelectedElements({ x: parseFloat(e.target.value) || 0 })}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
              <ProInput
                type="number"
                value={getCommonValue('y')}
                onChange={(e) => updateSelectedElements({ y: parseFloat(e.target.value) || 0 })}
                className="text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
              <ProInput
                type="number"
                value={getCommonValue('width')}
                onChange={(e) => updateSelectedElements({ width: parseFloat(e.target.value) || 0 })}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
              <ProInput
                type="number"
                value={getCommonValue('height')}
                onChange={(e) => updateSelectedElements({ height: parseFloat(e.target.value) || 0 })}
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Rotation</label>
            <ProInput
              type="number"
              value={getCommonValue('rotation')}
              onChange={(e) => updateSelectedElements({ rotation: parseFloat(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={getCommonValue('locked') === true}
              onChange={(e) => updateSelectedElements({ locked: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm text-gray-700">Locked</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={getCommonValue('visible') !== false}
              onChange={(e) => updateSelectedElements({ visible: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm text-gray-700">Visible</label>
          </div>
        </div>
      ),
    },
    {
      id: 'text',
      title: 'Text Properties',
      icon: <Type className="w-4 h-4" />,
      content: hasCommonType('text') || hasCommonType('cv-field') ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              value={getCommonValue('data.text')}
              onChange={(e) => updateElementData({ text: e.target.value })}
              placeholder={hasCommonType('cv-field') ? 'Field placeholder' : 'Enter text'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
            <ProInput
              type="number"
              value={getCommonValue('data.fontSize')}
              onChange={(e) => updateElementData({ fontSize: parseFloat(e.target.value) || 16 })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={getCommonValue('data.fontFamily')}
              onChange={(e) => updateElementData({ fontFamily: e.target.value })}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={getCommonValue('data.fontWeight')}
              onChange={(e) => updateElementData({ fontWeight: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
            <div className="flex space-x-1">
              <ProButton
                variant={getCommonValue('data.textAlign') === 'left' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateElementData({ textAlign: 'left' })}
              >
                <AlignLeft className="w-3 h-3" />
              </ProButton>
              <ProButton
                variant={getCommonValue('data.textAlign') === 'center' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateElementData({ textAlign: 'center' })}
              >
                <AlignCenter className="w-3 h-3" />
              </ProButton>
              <ProButton
                variant={getCommonValue('data.textAlign') === 'right' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateElementData({ textAlign: 'right' })}
              >
                <AlignRight className="w-3 h-3" />
              </ProButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Select a text element to edit text properties</div>
      ),
    },
    {
      id: 'style',
      title: 'Style',
      icon: <Palette className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={getCommonValue('style.backgroundColor') || '#ffffff'}
              onChange={(e) => updateElementStyle({ backgroundColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Border Color</label>
            <input
              type="color"
              value={getCommonValue('style.borderColor') || '#000000'}
              onChange={(e) => updateElementStyle({ borderColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Border Width</label>
            <ProInput
              type="number"
              value={getCommonValue('style.borderWidth')}
              onChange={(e) => updateElementStyle({ borderWidth: parseFloat(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
            <ProInput
              type="number"
              value={getCommonValue('style.borderRadius')}
              onChange={(e) => updateElementStyle({ borderRadius: parseFloat(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={getCommonValue('style.opacity') || 1}
              onChange={(e) => updateElementStyle({ opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-600">{Math.round((getCommonValue('style.opacity') || 1) * 100)}%</div>
          </div>
        </div>
      ),
    },
    {
      id: 'cv-field',
      title: 'CV Field',
      icon: <Settings className="w-4 h-4" />,
      content: hasCommonType('cv-field') ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={getCommonValue('data.fieldType')}
              onChange={(e) => updateElementData({ fieldType: e.target.value })}
            >
              <option value="personal-info">Personal Info</option>
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="skills">Skills</option>
              <option value="summary">Summary</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Field Key</label>
            <ProInput
              value={getCommonValue('data.fieldKey')}
              onChange={(e) => updateElementData({ fieldKey: e.target.value })}
              placeholder="e.g., firstName, email, companyName"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
            <ProInput
              value={getCommonValue('data.placeholder')}
              onChange={(e) => updateElementData({ placeholder: e.target.value })}
              placeholder="Field placeholder text"
              className="text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Select a CV field element to edit field properties</div>
      ),
    },
  ];

  if (selectedElements.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 text-sm">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            {selectedElements.length === 1 ? 'Element Properties' : `${selectedElements.length} Elements`}
          </h3>
          <ProButton
            variant="ghost"
            size="sm"
            onClick={() => onElementDelete(selectedElements.map(el => el.id))}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </ProButton>
        </div>
        {selectedElements.length === 1 && (
          <div className="text-xs text-gray-500 mt-1">
            Type: {selectedElements[0].type} • ID: {selectedElements[0].id}
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-2">
                {section.icon}
                <span className="text-sm font-medium text-gray-900">{section.title}</span>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes(section.id) && (
              <div className="px-4 pb-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
