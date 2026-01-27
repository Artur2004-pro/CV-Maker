import { TemplatePreset, TemplateElement } from '../types/template-creator';
import { CanvasElement, CVFieldElement, TextElement, ShapeElement } from '../types/canvas';
import { CVData } from '../types/api';

/**
 * Resolve CV field value from CVData based on binding metadata
 */
function resolveCVFieldValue(
  cvData: CVData,
  fieldType: 'personal-info' | 'experience' | 'education' | 'skills' | 'summary',
  fieldKey: string,
  index?: number
): string {
  console.log('[templateMapper] Resolving CV field:', { fieldType, fieldKey, index });

  switch (fieldType) {
    case 'personal-info':
      // Handle special cases
      if (fieldKey === 'fullName') {
        return `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim();
      }
      if (fieldKey === 'title') {
        // Title is not in CVData, return empty or placeholder
        return '';
      }
      // Direct field access
      if (fieldKey in cvData.personalInfo) {
        return (cvData.personalInfo as any)[fieldKey] || '';
      }
      return '';

    case 'summary':
      return cvData.personalInfo.summary || '';

    case 'experience':
      if (index !== undefined && index < cvData.experience.length) {
        const exp = cvData.experience[index];
        if (fieldKey in exp) {
          return (exp as any)[fieldKey] || '';
        }
      }
      return '';

    case 'education':
      if (index !== undefined && index < cvData.education.length) {
        const edu = cvData.education[index];
        if (fieldKey in edu) {
          return (edu as any)[fieldKey] || '';
        }
      }
      return '';

          case 'skills':
            if (index !== undefined && index < cvData.skills.length) {
              const skill = cvData.skills[index];
              if (fieldKey in skill) {
                return (skill as any)[fieldKey] || '';
              }
            }
            // If no index, return all skills as comma-separated string
            if (index === undefined) {
              if (fieldKey === 'name') {
                // Return all skill names
                return cvData.skills.map(s => s.name).join(', ');
              } else if (fieldKey === 'level') {
                // Return formatted skills with levels
                return cvData.skills.map(s => `${s.name} (${s.level})`).join(', ');
              }
              return cvData.skills.map(s => s.name).join(', ');
            }
            return '';

    default:
      console.warn('[templateMapper] Unknown field type:', fieldType);
      return '';
  }
}

/**
 * Convert TemplateElement to CanvasElement
 */
function convertTemplateElementToCanvasElement(
  templateElement: TemplateElement,
  cvData: CVData
): CanvasElement {
  const baseElement = {
    id: templateElement.id,
    x: templateElement.x,
    y: templateElement.y,
    width: templateElement.width,
    height: templateElement.height,
    rotation: templateElement.rotation,
    zIndex: templateElement.zIndex,
    locked: templateElement.locked,
    visible: templateElement.visible,
    style: {
      backgroundColor: templateElement.style.backgroundColor,
      color: templateElement.style.color,
      fontSize: templateElement.data.fontSize || templateElement.style.backgroundColor ? undefined : 12,
      fontWeight: templateElement.data.fontWeight || templateElement.style.backgroundColor ? undefined : 'normal',
      fontFamily: templateElement.data.fontFamily || 'Arial',
      textAlign: templateElement.data.textAlign || 'left',
      opacity: templateElement.style.opacity ?? 1,
      borderRadius: templateElement.style.borderRadius,
      border: templateElement.style.borderWidth
        ? `${templateElement.style.borderWidth}px solid ${templateElement.style.borderColor || '#000'}`
        : undefined,
    },
  };

  switch (templateElement.type) {
    case 'cv-field':
      // Convert cv-field to CVFieldElement
      const fieldType = templateElement.data.fieldType!;
      const fieldKey = templateElement.data.fieldKey!;
      
      // Extract index from fieldKey if present (e.g., "experience.0.company")
      let index: number | undefined;
      const indexMatch = fieldKey.match(/\.(\d+)\./);
      if (indexMatch) {
        index = parseInt(indexMatch[1], 10);
      }

      const resolvedContent = resolveCVFieldValue(
        cvData,
        fieldType,
        fieldKey.replace(/\.\d+\./, '.'), // Remove index from fieldKey
        index
      );

      const cvFieldElement: CVFieldElement = {
        ...baseElement,
        type: 'cv-field',
        content: resolvedContent || templateElement.data.placeholder || '',
        placeholder: templateElement.data.placeholder,
        multiline: fieldType === 'summary',
        cvBinding: {
          fieldType,
          fieldKey: fieldKey.replace(/\.\d+\./, '.'), // Clean fieldKey
          index,
        },
      };

      console.log('[templateMapper] Created CVFieldElement:', {
        id: cvFieldElement.id,
        binding: cvFieldElement.cvBinding,
        content: cvFieldElement.content,
      });

      return cvFieldElement;

    case 'text':
      const textElement: TextElement = {
        ...baseElement,
        type: 'text',
        content: templateElement.data.text || '',
        placeholder: templateElement.data.placeholder,
        multiline: false,
      };
      return textElement;

    case 'rectangle':
    case 'circle':
    case 'line':
      const shapeElement: ShapeElement = {
        ...baseElement,
        type: 'shape',
        shapeType: templateElement.type === 'line' ? 'line' : templateElement.type === 'circle' ? 'circle' : 'rectangle',
        fill: templateElement.data.fillColor,
        stroke: templateElement.data.strokeColor,
        strokeWidth: templateElement.data.strokeWidth,
      };
      return shapeElement;

    default:
      console.warn('[templateMapper] Unknown template element type:', templateElement.type);
      // Fallback to text element
      return {
        ...baseElement,
        type: 'text',
        content: '',
      } as TextElement;
  }
}

/**
 * Apply template to canvas by converting TemplatePreset elements to CanvasElements
 * and resolving CV field values from CVData
 */
export function applyTemplateToCanvas(
  template: TemplatePreset,
  cvData: CVData
): CanvasElement[] {
  console.log('[templateMapper] Applying template to canvas:', {
    templateId: template.id,
    elementCount: template.canvas.elements.length,
    cvData,
  });

  const canvasElements: CanvasElement[] = template.canvas.elements.map(element =>
    convertTemplateElementToCanvasElement(element, cvData)
  );

  console.log('[templateMapper] Converted elements:', canvasElements.length);
  return canvasElements;
}

/**
 * Generate unique ID for canvas elements
 */
export function generateCanvasElementId(): string {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

