import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CanvasProvider, useCanvas } from './CanvasContext';
import { CanvasElement, CVFieldElement } from '../types/canvas';
import { CVData } from '../types/api';
import { TemplatePreset } from '../types/template-creator';
import { applyTemplateToCanvas } from '../utils/templateMapper';
import { cvDataService } from '../services/cvDataService';
import { getTemplatePreset } from '../data/template-presets';

/**
 * CV Binding metadata for linking CanvasElements to CVData fields
 */
export interface CVBinding {
  fieldType: 'personal-info' | 'experience' | 'education' | 'skills' | 'summary';
  fieldKey: string;
  index?: number;
}

/**
 * CVCanvasContext provides CV-aware functionality on top of CanvasContext
 */
interface CVCanvasContextType {
  // CV Data
  cvData: CVData;
  setCVData: (cvData: CVData | ((prev: CVData) => CVData)) => void;
  
  // Template
  templateId: string | null;
  setTemplateId: (templateId: string | null) => void;
  
  // CV-Canvas synchronization
  updateCVFromElement: (elementId: string, newContent: string) => void;
  
  // Template application
  applyTemplate: (template: TemplatePreset, cvData: CVData) => void;
  
  // Save/Load
  saveCV: (cvId?: string) => Promise<boolean>;
  loadCV: (cvId: string) => Promise<boolean>;
}

const CVCanvasContext = createContext<CVCanvasContextType | undefined>(undefined);

interface CVCanvasProviderProps {
  children: ReactNode;
  initialCVData?: CVData;
  initialTemplateId?: string;
}

/**
 * CVCanvasProvider wraps CanvasProvider and adds CV-aware functionality
 * Manages CVData state, template application, and synchronization between CVData and CanvasElements
 */
export const CVCanvasProvider: React.FC<CVCanvasProviderProps> = ({
  children,
  initialCVData,
  initialTemplateId,
}) => {
  const [cvData, setCVDataState] = useState<CVData>(
    initialCVData || cvDataService.getDefaultCVData()
  );
  const [templateId, setTemplateIdState] = useState<string | null>(
    initialTemplateId || null
  );

  // Wrapper for setCVData to allow functional updates
  const setCVData = useCallback((update: CVData | ((prev: CVData) => CVData)) => {
    setCVDataState(prev => {
      const newCVData = typeof update === 'function' ? update(prev) : update;
      console.log('[CVCanvasProvider] CVData updated:', newCVData);
      return newCVData;
    });
  }, []);

  const setTemplateId = useCallback((id: string | null) => {
    console.log('[CVCanvasProvider] Template ID updated:', id);
    setTemplateIdState(id);
  }, []);

  // Get canvas context from inner provider
  const InnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state, dispatch } = useCanvas();

    /**
     * Update CVData when a CVFieldElement's content changes
     */
    const updateCVFromElement = useCallback((elementId: string, newContent: string) => {
      const element = state.elements.find(el => el.id === elementId);
      
      if (!element || element.type !== 'cv-field') {
        console.warn('[CVCanvasProvider] Element not found or not a CV field:', elementId);
        return;
      }

      const cvField = element as CVFieldElement;
      const binding = cvField.cvBinding;

      console.log('[CVCanvasProvider] Updating CVData from element:', {
        elementId,
        binding,
        newContent,
      });

      setCVData(prev => {
        const updated = { ...prev };

        switch (binding.fieldType) {
          case 'personal-info':
            // Handle personal info fields
            if (binding.fieldKey === 'fullName') {
              const [firstName, ...lastNameParts] = newContent.split(' ');
              updated.personalInfo = {
                ...updated.personalInfo,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
              };
            } else if (binding.fieldKey in updated.personalInfo) {
              updated.personalInfo = {
                ...updated.personalInfo,
                [binding.fieldKey]: newContent,
              };
            }
            break;

          case 'summary':
            updated.personalInfo = {
              ...updated.personalInfo,
              summary: newContent,
            };
            break;

          case 'experience':
            if (binding.index !== undefined && binding.index < updated.experience.length) {
              const exp = updated.experience[binding.index];
              updated.experience[binding.index] = {
                ...exp,
                [binding.fieldKey]: newContent,
              };
            }
            break;

          case 'education':
            if (binding.index !== undefined && binding.index < updated.education.length) {
              const edu = updated.education[binding.index];
              updated.education[binding.index] = {
                ...edu,
                [binding.fieldKey]: newContent,
              };
            }
            break;

          case 'skills':
            // Handle skills array - parse comma-separated values
            if (binding.fieldKey === 'name' && binding.index === undefined) {
              // Update all skills from comma-separated string
              const skillNames = newContent.split(',').map(s => s.trim()).filter(s => s);
              updated.skills = skillNames.map((name, idx) => ({
                id: updated.skills[idx]?.id || String(idx + 1),
                name,
                level: updated.skills[idx]?.level || 'Intermediate',
              }));
            } else if (binding.index !== undefined && binding.index < updated.skills.length) {
              const skill = updated.skills[binding.index];
              updated.skills[binding.index] = {
                ...skill,
                [binding.fieldKey]: newContent,
              };
            }
            break;

          default:
            console.warn('[CVCanvasProvider] Unknown field type:', binding.fieldType);
        }

        return updated;
      });
    }, [state.elements, setCVData]);

    /**
     * Apply template to canvas, converting TemplatePreset elements to CanvasElements
     */
    const applyTemplate = useCallback((template: TemplatePreset, cvDataToApply: CVData) => {
      console.log('[CVCanvasProvider] Applying template:', template.id, 'with CVData:', cvDataToApply);
      
      const canvasElements = applyTemplateToCanvas(template, cvDataToApply);
      
      // Clear existing elements and add template elements
      dispatch({ type: 'RESET_CANVAS' });
      
      // Set canvas size from template
      dispatch({
        type: 'SET_CANVAS_SIZE',
        width: template.canvas.width,
        height: template.canvas.height,
      });

      // Add all elements
      canvasElements.forEach(element => {
        dispatch({ type: 'ADD_ELEMENT', element });
      });

      console.log('[CVCanvasProvider] Template applied, elements added:', canvasElements.length);
    }, [dispatch]);

    /**
     * Save CV to backend
     */
    const saveCV = useCallback(async (cvId?: string, name?: string): Promise<boolean> => {
      try {
        console.log('[CVCanvasProvider] Saving CV:', { cvId, templateId, cvData });
        
        if (!templateId) {
          console.error('[CVCanvasProvider] Template ID is required for saving');
          return false;
        }

        const response = await cvDataService.saveCVData(cvData, templateId, cvId, name);
        
        if (response.success) {
          console.log('[CVCanvasProvider] CV saved successfully:', response.id);
          return true;
        } else {
          console.error('[CVCanvasProvider] Failed to save CV');
          return false;
        }
      } catch (error) {
        console.error('[CVCanvasProvider] Error saving CV:', error);
        return false;
      }
    }, [cvData, templateId]);

    /**
     * Load CV from backend
     */
    const loadCV = useCallback(async (cvId: string): Promise<boolean> => {
      try {
        console.log('[CVCanvasProvider] Loading CV:', cvId);
        
        const loaded = await cvDataService.getCVDataById(cvId);
        
        if (loaded && loaded.cvData) {
          setCVData(loaded.cvData);
          
          // Update template ID if provided
          if (loaded.templateId) {
            setTemplateId(loaded.templateId);
          }
          
          // Reload template
          const templateIdToUse = loaded.templateId || templateId;
          if (templateIdToUse) {
            const template = getTemplatePreset(templateIdToUse);
            if (template) {
              applyTemplate(template, loaded.cvData);
            }
          }
          
          console.log('[CVCanvasProvider] CV loaded successfully');
          return true;
        } else {
          console.error('[CVCanvasProvider] CV not found');
          return false;
        }
      } catch (error) {
        console.error('[CVCanvasProvider] Error loading CV:', error);
        return false;
      }
    }, [setCVData, setTemplateId, templateId, applyTemplate]);

    const value: CVCanvasContextType = {
      cvData,
      setCVData,
      templateId,
      setTemplateId,
      updateCVFromElement,
      applyTemplate,
      saveCV,
      loadCV,
    };

    return (
      <CVCanvasContext.Provider value={value}>
        {children}
      </CVCanvasContext.Provider>
    );
  };

  return (
    <CanvasProvider>
      <InnerProvider>{children}</InnerProvider>
    </CanvasProvider>
  );
};

/**
 * Hook to access CVCanvasContext
 */
export const useCVCanvas = (): CVCanvasContextType => {
  const context = useContext(CVCanvasContext);
  if (context === undefined) {
    throw new Error('useCVCanvas must be used within a CVCanvasProvider');
  }
  return context;
};

export default CVCanvasContext;

