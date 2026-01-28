import React, { useState, useRef, useContext } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import CVCanvasContext from '../../contexts/CVCanvasContext';
import { canvasStorageService } from '../../services/canvasStorageService';
import { CVProject, CanvasState, CanvasElement, HeadingElement, TextElement, CVFieldElement } from '../../types/canvas';
import { ProfessionalIcons } from '../ui/IconSystem';
import { fileUploadService } from '../../services/fileUploadService';
import { pdfParserService } from '../../services/pdfParserService';
import { CVData } from '../../types/api';
import { templatePresets, getTemplatePreset } from '../../data/template-presets';
import toast from 'react-hot-toast';

interface CanvasSaveLoadProps {
  projectId?: string;
  onSave?: (project: CVProject) => void;
  onLoad?: (project: CVProject) => void;
}

// Convert CV data to canvas elements
const createCanvasElementsFromCVData = (cvData: CVData): CanvasElement[] => {
  const elements: CanvasElement[] = [];
  let yPosition = 50;
  const lineHeight = 30;
  const sectionSpacing = 40;
  let idCounter = 0;

  // Helper function to generate unique element ID
  const generateId = () => {
    idCounter++;
    return `element_${Date.now()}_${idCounter}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Name (Heading)
  const fullName = `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim();
  if (fullName) {
    const nameElement: HeadingElement = {
      id: generateId(),
      type: 'heading',
      content: fullName,
      level: 1,
      x: 50,
      y: yPosition,
      width: 694,
      height: 50,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        padding: 10,
      },
    };
    elements.push(nameElement);
    yPosition += 60;
  }

  // Contact Info (Text)
  const contactInfo: string[] = [];
  if (cvData.personalInfo.email) contactInfo.push(cvData.personalInfo.email);
  if (cvData.personalInfo.phone) contactInfo.push(cvData.personalInfo.phone);
  if (cvData.personalInfo.location) contactInfo.push(cvData.personalInfo.location);
  
  if (contactInfo.length > 0) {
    const contactElement: TextElement = {
      id: generateId(),
      type: 'text',
      content: contactInfo.join(' | '),
      x: 50,
      y: yPosition,
      width: 694,
      height: 30,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        padding: 5,
      },
    };
    elements.push(contactElement);
    yPosition += 40;
  }

  // Summary Section
  if (cvData.personalInfo.summary && cvData.personalInfo.summary.trim()) {
    const summaryHeading: HeadingElement = {
      id: generateId(),
      type: 'heading',
      content: 'Summary',
      level: 2,
      x: 50,
      y: yPosition,
      width: 694,
      height: 35,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        padding: 5,
      },
    };
    elements.push(summaryHeading);
    yPosition += 40;

    const summaryText = cvData.personalInfo.summary.trim();
    const summaryElement: CVFieldElement = {
      id: generateId(),
      type: 'cv-field',
      content: summaryText,
      multiline: true,
      cvBinding: {
        fieldType: 'summary',
        fieldKey: 'summary',
      },
      x: 50,
      y: yPosition,
      width: 694,
      height: Math.max(60, Math.ceil(summaryText.length / 80) * 20),
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 12,
        color: '#4b5563',
        textAlign: 'left',
        padding: 8,
        lineHeight: 1.5,
      },
    };
    elements.push(summaryElement);
    yPosition += summaryElement.height + 20;
  }

  // Experience Section
  if (cvData.experience && cvData.experience.length > 0) {
    const expHeading: HeadingElement = {
      id: generateId(),
      type: 'heading',
      content: 'Experience',
      level: 2,
      x: 50,
      y: yPosition,
      width: 694,
      height: 30,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
      },
    };
    elements.push(expHeading);
    yPosition += 35;

    cvData.experience.forEach((exp, index) => {
      // Create position element
      const positionText = exp.position || '';
      if (positionText) {
        const positionElement: CVFieldElement = {
          id: generateId(),
          type: 'cv-field',
          content: positionText,
          multiline: false,
          cvBinding: {
            fieldType: 'experience',
            fieldKey: 'position',
            index,
          },
          x: 50,
          y: yPosition,
          width: 694,
          height: 25,
          rotation: 0,
          zIndex: elements.length,
          locked: false,
          visible: true,
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'left',
          },
        };
        elements.push(positionElement);
        yPosition += 30;
      }

      // Create company and dates element
      const companyDates = [
        exp.company || '',
        `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`.trim()
      ].filter(Boolean).join(' | ');
      
      if (companyDates) {
        const companyElement: CVFieldElement = {
          id: generateId(),
          type: 'cv-field',
          content: companyDates,
          multiline: false,
          cvBinding: {
            fieldType: 'experience',
            fieldKey: 'company',
            index,
          },
          x: 50,
          y: yPosition,
          width: 694,
          height: 20,
          rotation: 0,
          zIndex: elements.length,
          locked: false,
          visible: true,
          style: {
            fontSize: 12,
            color: '#6b7280',
            textAlign: 'left',
          },
        };
        elements.push(companyElement);
        yPosition += 25;
      }

      // Create description element
      if (exp.description) {
        const descElement: CVFieldElement = {
          id: generateId(),
          type: 'cv-field',
          content: exp.description,
          multiline: true,
          cvBinding: {
            fieldType: 'experience',
            fieldKey: 'description',
            index,
          },
          x: 50,
          y: yPosition,
          width: 694,
          height: 60,
          rotation: 0,
          zIndex: elements.length,
          locked: false,
          visible: true,
          style: {
            fontSize: 12,
            color: '#4b5563',
            textAlign: 'left',
          },
        };
        elements.push(descElement);
        yPosition += 70;
      }
      
      yPosition += 20; // Spacing between experiences
    });
    yPosition += sectionSpacing;
  }

  // Education Section
  if (cvData.education && cvData.education.length > 0) {
    const eduHeading: HeadingElement = {
      id: generateId(),
      type: 'heading',
      content: 'Education',
      level: 2,
      x: 50,
      y: yPosition,
      width: 694,
      height: 30,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
      },
    };
    elements.push(eduHeading);
    yPosition += 35;

    cvData.education.forEach((edu, index) => {
      // Create degree and field element
      const degreeField = [
        edu.degree || '',
        edu.field ? `in ${edu.field}` : ''
      ].filter(Boolean).join(' ');
      
      if (degreeField) {
        const degreeElement: CVFieldElement = {
          id: generateId(),
          type: 'cv-field',
          content: degreeField,
          multiline: false,
          cvBinding: {
            fieldType: 'education',
            fieldKey: 'degree',
            index,
          },
          x: 50,
          y: yPosition,
          width: 694,
          height: 25,
          rotation: 0,
          zIndex: elements.length,
          locked: false,
          visible: true,
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'left',
          },
        };
        elements.push(degreeElement);
        yPosition += 30;
      }

      // Create school and dates element
      const schoolDates = [
        edu.school || '',
        `${edu.startDate || ''} - ${edu.current ? 'Present' : edu.endDate || ''}`.trim()
      ].filter(Boolean).join(' | ');
      
      if (schoolDates) {
        const schoolElement: CVFieldElement = {
          id: generateId(),
          type: 'cv-field',
          content: schoolDates,
          multiline: false,
          cvBinding: {
            fieldType: 'education',
            fieldKey: 'school',
            index,
          },
          x: 50,
          y: yPosition,
          width: 694,
          height: 20,
          rotation: 0,
          zIndex: elements.length,
          locked: false,
          visible: true,
          style: {
            fontSize: 12,
            color: '#6b7280',
            textAlign: 'left',
          },
        };
        elements.push(schoolElement);
        yPosition += 30;
      }
      
      yPosition += 15; // Spacing between education entries
    });
    yPosition += sectionSpacing;
  }

  // Skills Section
  if (cvData.skills && cvData.skills.length > 0) {
    const skillsHeading: HeadingElement = {
      id: generateId(),
      type: 'heading',
      content: 'Skills',
      level: 2,
      x: 50,
      y: yPosition,
      width: 694,
      height: 35,
      rotation: 0,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        padding: 5,
      },
    };
    elements.push(skillsHeading);
    yPosition += 40;

    const skillsText = cvData.skills.map(s => s.name).filter(Boolean).join(', ');
    if (skillsText) {
      const skillsElement: TextElement = {
        id: generateId(),
        type: 'text',
        content: skillsText,
        x: 50,
        y: yPosition,
        width: 694,
        height: 35,
        rotation: 0,
        zIndex: elements.length,
        locked: false,
        visible: true,
        style: {
          fontSize: 12,
          color: '#4b5563',
          textAlign: 'left',
          padding: 8,
        },
      };
      elements.push(skillsElement);
    }
  }

  return elements;
};

const CanvasSaveLoad: React.FC<CanvasSaveLoadProps> = ({
  projectId,
  onSave,
  onLoad,
}) => {
  const { state, dispatch } = useCanvas();
  // Get CVCanvas context if available (for CV editor)
  // Using useContext directly to avoid hook rule violations
  const cvCanvasContext = useContext(CVCanvasContext);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name', {
        icon: '⚠️',
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const project: CVProject = {
        id: projectId || canvasStorageService.generateProjectId(),
        name: projectName,
        thumbnail: canvasStorageService.generateThumbnail(state),
        lastModified: new Date(),
        createdAt: new Date(),
        canvasState: state,
        metadata: {
          version: '1.0.0',
          tags: ['cv', 'professional'],
        },
      };

      canvasStorageService.saveProject(project);
      onSave?.(project);
      setShowSaveDialog(false);
      setProjectName('');
      
      toast.success('Project saved successfully!', {
        icon: '✅',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to save project:', error);
      const errorMessage = error?.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('QuotaExceededError')) {
        toast.error('Storage quota exceeded. Please delete some old projects or clear your browser storage.', {
          icon: '💾',
          duration: 5000,
        });
      } else {
        toast.error('Failed to save project', {
          icon: '❌',
          duration: 3000,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = (projectId: string) => {
    setIsLoading(true);
    try {
      const project = canvasStorageService.getProject(projectId);
      if (project) {
        dispatch({ type: 'LOAD_PROJECT', project });
        onLoad?.(project);
        toast.success('Project loaded successfully!', {
          icon: '📂',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project', {
        icon: '❌',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const projectData = canvasStorageService.exportProject(projectId || '');
      if (projectData) {
        const blob = new Blob([projectData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'cv-project'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Project exported successfully!', {
          icon: '💾',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to export project:', error);
      toast.error('Failed to export project', {
        icon: '❌',
        duration: 3000,
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      // Check if file is PDF
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        console.log('[CanvasSaveLoad] Starting PDF import with visual parsing...');
        
        try {
          // NEW APPROACH: Parse PDF into visual blocks (text and images with positions)
          const parseResult = await pdfParserService.parsePDF(file);
          console.log('[CanvasSaveLoad] PDF parsed:', {
            textBlocks: parseResult.textBlocks.length,
            imageBlocks: parseResult.imageBlocks.length,
            pageCount: parseResult.pageCount,
            dimensions: `${parseResult.pageWidth}x${parseResult.pageHeight}`
          });

          // Convert parsed content to canvas elements
          const canvasElements = pdfParserService.convertToCanvasElements(
            parseResult,
            state.canvasWidth,
            state.canvasHeight
          );

          console.log('[CanvasSaveLoad] Created', canvasElements.length, 'canvas elements from PDF');

          if (canvasElements.length === 0) {
            throw new Error('No content found in PDF. The PDF might be empty or contain only images.');
          }

          // Ensure all elements are editable
          const editableElements = canvasElements.map(element => ({
            ...element,
            locked: false,
            visible: true,
          }));

          // Update canvas size if PDF has different dimensions
          const newCanvasWidth = parseResult.pageWidth || state.canvasWidth;
          const newCanvasHeight = parseResult.pageHeight || state.canvasHeight;

          // Create new canvas state with imported elements
          const newCanvasState: CanvasState = {
            ...state,
            elements: editableElements,
            canvasWidth: newCanvasWidth,
            canvasHeight: newCanvasHeight,
            selectedElementIds: [],
            clipboard: [],
            history: [],
            historyIndex: -1,
          };

          // Also try to extract structured CV data for metadata
          let cvData: CVData | null = null;
          try {
            const cvResult = await fileUploadService.uploadCVFile(file);
            if (cvResult.success && cvResult.cvData) {
              cvData = cvResult.cvData;
              console.log('[CanvasSaveLoad] Also extracted structured CV data');
            }
          } catch (cvError) {
            console.warn('[CanvasSaveLoad] Failed to extract structured CV data:', cvError);
            // Continue without structured data - visual blocks are more important
          }

          // Convert to canvas project format
          const project: CVProject = {
            id: canvasStorageService.generateProjectId(),
            name: file.name.replace('.pdf', ''),
            thumbnail: canvasStorageService.generateThumbnail(newCanvasState),
            lastModified: new Date(),
            createdAt: new Date(),
            canvasState: newCanvasState,
            metadata: {
              version: '1.0.0',
              tags: ['cv', 'imported', 'pdf', 'visual-parsed'],
              cvData: cvData || undefined,
            },
          };

          console.log('[CanvasSaveLoad] Saving project with visual blocks');
          canvasStorageService.saveProject(project);

          console.log('[CanvasSaveLoad] Loading project into editor');
          dispatch({ type: 'LOAD_PROJECT', project });
          onLoad?.(project);

          toast.success(`PDF imported successfully! ${canvasElements.length} editable blocks created.`, {
            icon: '📄',
            duration: 4000,
          });

        } catch (parseError: any) {
          console.error('[CanvasSaveLoad] Visual parsing failed, falling back to structured import:', parseError);
          
          // FALLBACK: Try structured import (original method)
          const result = await fileUploadService.uploadCVFile(file);
          if (result.success && result.cvData) {
            console.log('[CanvasSaveLoad] Fallback: PDF imported as structured data:', result.cvData);
            
            // Update CVData in CVCanvasContext if available and apply template
            if (cvCanvasContext) {
              console.log('[CanvasSaveLoad] Updating CVData in CVCanvasContext');
              cvCanvasContext.setCVData(result.cvData);
              
              // Apply template if available (preferred method - uses template structure)
              const templateId = cvCanvasContext.templateId || templatePresets[0]?.id;
              if (templateId) {
                const template = getTemplatePreset(templateId);
                if (template) {
                  console.log('[CanvasSaveLoad] Applying template after PDF import:', templateId);
                  cvCanvasContext.applyTemplate(template, result.cvData);
                  
                  toast.success('PDF imported successfully! Template applied. You can now edit the CV.', {
                    icon: '📄',
                    duration: 4000,
                  });
                  
                  setIsLoading(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  return;
                }
              }
            }
            
            // Fallback: Convert CV data to canvas elements manually
            console.log('[CanvasSaveLoad] No template available, creating elements manually');
            const canvasElements = createCanvasElementsFromCVData(result.cvData);
            
            const editableElements = canvasElements.map(element => ({
              ...element,
              locked: false,
              visible: true,
            }));
            
            const newCanvasState: CanvasState = {
              ...state,
              elements: editableElements,
              selectedElementIds: [],
              clipboard: [],
              history: [],
              historyIndex: -1,
            };
            
            const project: CVProject = {
              id: canvasStorageService.generateProjectId(),
              name: file.name.replace('.pdf', ''),
              thumbnail: canvasStorageService.generateThumbnail(newCanvasState),
              lastModified: new Date(),
              createdAt: new Date(),
              canvasState: newCanvasState,
              metadata: {
                version: '1.0.0',
                tags: ['cv', 'imported', 'pdf'],
                cvData: result.cvData,
              },
            };
            
            canvasStorageService.saveProject(project);
            dispatch({ type: 'LOAD_PROJECT', project });
            onLoad?.(project);
            
            toast.success('PDF imported successfully! You can now edit the CV.', {
              icon: '📄',
              duration: 4000,
            });
          } else {
            throw new Error(result.error || 'Failed to parse PDF');
          }
        }
      } else {
        // Handle JSON import (existing functionality)
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = e.target?.result as string;
            const project = canvasStorageService.importProject(jsonData);
            if (project) {
              dispatch({ type: 'LOAD_PROJECT', project });
              onLoad?.(project);
              
              toast.success('Project imported successfully!', {
                icon: '📂',
                duration: 3000,
              });
            }
          } catch (error) {
            console.error('Failed to import project:', error);
            toast.error('Failed to import project. Please make sure it is a valid JSON or PDF file.', {
              icon: '❌',
              duration: 4000,
            });
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
        return; // Early return for JSON files
      }
    } catch (error: any) {
      console.error('Failed to import file:', error);
      
      // Check if it's a quota exceeded error
      const errorMessage = error?.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('QuotaExceededError')) {
        toast.error('Storage quota exceeded. Please delete some old projects or clear your browser storage.', {
          icon: '💾',
          duration: 5000,
        });
      } else {
        toast.error(`Failed to import file: ${error instanceof Error ? error.message : 'Unknown error'}`, {
          icon: '❌',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (projectId: string) => {
    const project = canvasStorageService.getProject(projectId);
    const projectName = project?.name || 'this project';
    
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      try {
        canvasStorageService.deleteProject(projectId);
        toast.success('Project deleted successfully!', {
          icon: '🗑️',
          duration: 3000,
        });
        // Refresh the projects list
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast.error('Failed to delete project', {
          icon: '❌',
          duration: 3000,
        });
      }
    }
  };

  const projects = canvasStorageService.getAllProjects();

  return (
    <div className="canvas-save-load">
      {/* Save/Load Toolbar */}
      <div className="flex items-center space-x-2 p-2 bg-gray-100 border-b border-gray-200">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isSaving}
        >
          <ProfessionalIcons.SaveIcon size="sm" />
          <span className="text-sm">Save</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          <ProfessionalIcons.DownloadIcon size="sm" />
          <span className="text-sm">Export</span>
        </button>

        <label className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer">
          <ProfessionalIcons.UploadIcon size="sm" />
          <span className="text-sm">Import</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,.pdf,application/pdf"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save CV Project</h3>
            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Projects</h3>
          <div className="space-y-2">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div>
                    <div className="text-sm font-medium">{project.name}</div>
                    <div className="text-xs text-gray-500">
                      {project.lastModified.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleLoad(project.id)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Load"
                  >
                    <ProfessionalIcons.ViewIcon size="sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <ProfessionalIcons.TrashIcon size="sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasSaveLoad;
