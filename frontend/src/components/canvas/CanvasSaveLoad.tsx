import React, { useState, useRef, useCallback } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import { canvasStorageService } from '../../services/canvasStorageService';
import { CVProject, ImageElement, TextElement } from '../../types/canvas';
import { ProfessionalIcons } from '../ui/IconSystem';
import { fileUploadService } from '../../services/fileUploadService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { pdfToImageSimple, extractPDFText, PDFTextItem } from '../../utils/pdfToImage';

interface CanvasSaveLoadProps {
  projectId?: string;
  onSave?: (project: CVProject) => void;
  onLoad?: (project: CVProject) => void;
}

const CanvasSaveLoad: React.FC<CanvasSaveLoadProps> = ({
  projectId,
  onSave,
  onLoad,
}) => {
  const { state, dispatch } = useCanvas();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
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
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Project saved successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
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
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project');
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
      }
    } catch (error) {
      console.error('Failed to export project:', error);
      alert('Failed to export project');
    }
  };

  // Handle JSON import
  const handleJSONImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const project = canvasStorageService.importProject(jsonData);
        if (project) {
          dispatch({ type: 'LOAD_PROJECT', project });
          onLoad?.(project);
          toast.success('Project imported successfully!');
        } else {
          toast.error('Failed to import project: Invalid format');
        }
      } catch (error) {
        console.error('Failed to import project:', error);
        toast.error('Failed to import project');
      }
    };
    reader.readAsText(file);
  }, [dispatch, onLoad]);

  // Group text items by proximity to avoid too many small elements
  const groupTextItems = useCallback((items: PDFTextItem[], proximityThreshold: number): Array<PDFTextItem & { text: string }> => {
    if (items.length === 0) return [];
    
    const groups: Array<PDFTextItem & { text: string }> = [];
    const used = new Set<number>();
    
    items.forEach((item, index) => {
      if (used.has(index)) return;
      
      // Find nearby items
      const group: PDFTextItem[] = [item];
      used.add(index);
      
      items.forEach((otherItem, otherIndex) => {
        if (used.has(otherIndex)) return;
        
        const distance = Math.sqrt(
          Math.pow(item.x - otherItem.x, 2) + Math.pow(item.y - otherItem.y, 2)
        );
        
        // Check if items are on the same line (similar Y position)
        const sameLine = Math.abs(item.y - otherItem.y) < item.height * 0.5;
        
        if (sameLine && distance < proximityThreshold) {
          group.push(otherItem);
          used.add(otherIndex);
        }
      });
      
      // Combine grouped items
      const combined = group.reduce((acc, curr) => {
        return {
          ...acc,
          text: acc.text + (acc.text && !acc.text.endsWith(' ') && !curr.text.startsWith(' ') ? ' ' : '') + curr.text,
          x: Math.min(acc.x, curr.x),
          y: Math.min(acc.y, curr.y),
          width: Math.max(acc.x + acc.width, curr.x + curr.width) - Math.min(acc.x, curr.x),
          height: Math.max(acc.height, curr.height),
          fontSize: Math.max(acc.fontSize, curr.fontSize),
        };
      });
      
      groups.push(combined as PDFTextItem & { text: string });
    });
    
    return groups;
  }, []);

  // Handle PDF import
  const handlePDFImport = useCallback(async (file: File) => {
    setIsProcessingPDF(true);
    try {
      toast.loading('Processing PDF file...', { id: 'pdf-processing' });
      
      // Convert PDF to image
      toast.loading('Converting PDF to image...', { id: 'pdf-converting' });
      const imageDataUrl = await pdfToImageSimple(file);
      toast.dismiss('pdf-converting');
      
      // Extract text from PDF
      toast.loading('Extracting text from PDF...', { id: 'pdf-text-extracting' });
      const textItems = await extractPDFText(file);
      toast.dismiss('pdf-text-extracting');
      
      // Load image to get actual dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageDataUrl;
      });
      
      // Calculate dimensions to fit canvas while maintaining aspect ratio
      const canvasAspect = state.canvasWidth / state.canvasHeight;
      const imageAspect = img.width / img.height;
      
      let width = state.canvasWidth;
      let height = state.canvasHeight;
      let scaleX = 1;
      let scaleY = 1;
      
      if (imageAspect > canvasAspect) {
        // Image is wider, fit to width
        height = state.canvasWidth / imageAspect;
        scaleX = scaleY = state.canvasWidth / img.width;
      } else {
        // Image is taller, fit to height
        width = state.canvasHeight * imageAspect;
        scaleX = scaleY = state.canvasHeight / img.height;
      }
      
      // Center the image
      const x = (state.canvasWidth - width) / 2;
      const y = (state.canvasHeight - height) / 2;
      
      // Create image element from PDF (background layer)
      const imageElement: ImageElement = {
        id: `pdf-image-${Date.now()}`,
        type: 'image',
        src: imageDataUrl,
        alt: file.name,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: width,
        height: height,
        rotation: 0,
        zIndex: 0, // Background layer
        locked: true, // Lock background image
        visible: true,
        objectFit: 'contain',
        style: {
          backgroundColor: 'transparent',
          opacity: 0.3, // Make background semi-transparent so text is visible
        },
      };

      // Add image element to canvas first
      dispatch({ type: 'ADD_ELEMENT', element: imageElement });
      
      // Create editable text elements from extracted text
      if (textItems.length > 0) {
        toast.loading(`Creating ${textItems.length} editable text elements...`, { id: 'pdf-text-creating' });
        
        // Group text items by proximity (to avoid too many small elements)
        const groupedTextItems = groupTextItems(textItems, 30); // 30px proximity threshold
        
        groupedTextItems.forEach((group, index) => {
          // Calculate position relative to canvas
          const textX = (group.x * scaleX) + Math.max(0, x);
          const textY = (group.y * scaleY) + Math.max(0, y);
          
          // Create text element
          const textElement: TextElement = {
            id: `pdf-text-${Date.now()}-${index}`,
            type: 'text',
            content: group.text,
            x: Math.max(0, Math.min(textX, state.canvasWidth - 100)),
            y: Math.max(0, Math.min(textY, state.canvasHeight - 50)),
            width: Math.max(100, Math.min(group.width * scaleX, state.canvasWidth - textX)),
            height: Math.max(30, Math.min(group.height * scaleY || 30, state.canvasHeight - textY)),
            rotation: 0,
            zIndex: index + 1, // Above background image
            locked: false,
            visible: true,
            multiline: group.text.length > 50,
            style: {
              backgroundColor: 'transparent',
              color: '#000000',
              fontSize: Math.max(10, Math.min(group.fontSize * scaleY, 24)),
              fontWeight: 'normal',
              fontFamily: group.fontName || 'Arial, sans-serif',
              textAlign: 'left',
              border: 'none',
              borderRadius: 0,
              opacity: 1,
              padding: 4,
              margin: 0,
            },
          };
          
          dispatch({ type: 'ADD_ELEMENT', element: textElement });
        });
        
        toast.dismiss('pdf-text-creating');
        toast.success(`PDF imported with ${groupedTextItems.length} editable text elements!`, { id: 'pdf-processing' });
      } else {
        toast.success('PDF imported as image. You can add text elements manually.', { id: 'pdf-processing' });
      }
      
      // Note: Text elements are already created above, so we don't need to extract CV data separately
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to import PDF file: ' + (error instanceof Error ? error.message : 'Unknown error'), { id: 'pdf-processing' });
    } finally {
      setIsProcessingPDF(false);
    }
  }, [dispatch, state.canvasWidth, state.canvasHeight, groupTextItems]);

  // Handle file import (JSON or PDF)
  const handleImport = useCallback(async (file: File) => {
    if (!file) return;

    // Check file type
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      await handlePDFImport(file);
    } else if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
      handleJSONImport(file);
    } else {
      toast.error('Unsupported file type. Please upload PDF or JSON files.');
    }
  }, [handlePDFImport, handleJSONImport]);

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleImport(files[0]);
    }
  }, [handleImport]);

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        canvasStorageService.deleteProject(projectId);
        // Refresh the projects list
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const projects = canvasStorageService.getAllProjects();

  return (
    <div 
      ref={dropZoneRef}
      className="canvas-save-load"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-purple-500 bg-opacity-20 border-2 border-purple-500 border-dashed z-50 flex items-center justify-center">
          <div className="text-center">
            <ProfessionalIcons.UploadIcon size="xl" className="mx-auto mb-2 text-purple-500" />
            <p className="text-purple-500 font-semibold">Drop PDF or JSON file here</p>
          </div>
        </div>
      )}

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
            accept=".json,.pdf,application/json,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isProcessingPDF}
          />
        </label>
        {isProcessingPDF && (
          <div className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
            <span>Processing PDF...</span>
          </div>
        )}
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
