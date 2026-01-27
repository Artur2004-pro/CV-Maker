import React, { useState, useRef } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import { canvasStorageService } from '../../services/canvasStorageService';
import { CVProject } from '../../types/canvas';
import { ProfessionalIcons } from '../ui/IconSystem';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const project = canvasStorageService.importProject(jsonData);
        if (project) {
          dispatch({ type: 'LOAD_PROJECT', project });
          onLoad?.(project);
        }
      } catch (error) {
        console.error('Failed to import project:', error);
        alert('Failed to import project');
      }
    };
    reader.readAsText(file);
  };

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
            accept=".json"
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
