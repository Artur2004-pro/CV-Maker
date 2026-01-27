import { CVProject, CanvasState } from '../types/canvas';

class CanvasStorageService {
  private readonly STORAGE_KEY = 'cv_canvas_projects';

  // Save a CV project
  saveProject(project: CVProject): void {
    try {
      const existingProjects = this.getAllProjects();
      const projectIndex = existingProjects.findIndex(p => p.id === project.id);
      
      if (projectIndex >= 0) {
        existingProjects[projectIndex] = project;
      } else {
        existingProjects.push(project);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingProjects));
    } catch (error) {
      console.error('Failed to save project:', error);
      throw new Error('Failed to save project');
    }
  }

  // Get all CV projects
  getAllProjects(): CVProject[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const projects = JSON.parse(stored);
      return projects.map((project: any) => ({
        ...project,
        lastModified: new Date(project.lastModified),
        createdAt: new Date(project.createdAt),
      }));
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  // Get a specific CV project by ID
  getProject(id: string): CVProject | null {
    try {
      const projects = this.getAllProjects();
      return projects.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Failed to get project:', error);
      return null;
    }
  }

  // Delete a CV project
  deleteProject(id: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  // Duplicate a CV project
  duplicateProject(id: string, newName?: string): CVProject | null {
    try {
      const originalProject = this.getProject(id);
      if (!originalProject) return null;

      const duplicatedProject: CVProject = {
        ...originalProject,
        id: this.generateProjectId(),
        name: newName || `${originalProject.name} (Copy)`,
        lastModified: new Date(),
        createdAt: new Date(),
        canvasState: {
          ...originalProject.canvasState,
          elements: originalProject.canvasState.elements.map(el => ({
            ...el,
            id: this.generateElementId(),
            x: el.x + 20,
            y: el.y + 20,
          })),
        },
      };

      this.saveProject(duplicatedProject);
      return duplicatedProject;
    } catch (error) {
      console.error('Failed to duplicate project:', error);
      return null;
    }
  }

  // Export project as JSON
  exportProject(id: string): string | null {
    try {
      const project = this.getProject(id);
      if (!project) return null;
      
      return JSON.stringify(project, null, 2);
    } catch (error) {
      console.error('Failed to export project:', error);
      return null;
    }
  }

  // Import project from JSON
  importProject(jsonData: string): CVProject | null {
    try {
      const projectData = JSON.parse(jsonData);
      
      // Validate project structure
      if (!this.validateProject(projectData)) {
        throw new Error('Invalid project format');
      }

      const project: CVProject = {
        ...projectData,
        id: this.generateProjectId(),
        lastModified: new Date(),
        createdAt: new Date(),
      };

      this.saveProject(project);
      return project;
    } catch (error) {
      console.error('Failed to import project:', error);
      return null;
    }
  }

  // Generate thumbnail from canvas state
  generateThumbnail(canvasState: CanvasState): string {
    // This is a placeholder - in a real implementation, you would
    // render the canvas to an off-screen canvas and generate a thumbnail
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="280" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
        <text x="100" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">
          ${canvasState.elements.length} elements
        </text>
        <text x="100" y="50" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
          CV Preview
        </text>
      </svg>
    `)}`;
  }

  // Get storage usage statistics
  getStorageStats(): { totalProjects: number; totalSize: number } {
    try {
      const projects = this.getAllProjects();
      const storageData = localStorage.getItem(this.STORAGE_KEY) || '';
      return {
        totalProjects: projects.length,
        totalSize: new Blob([storageData]).size,
      };
    } catch (error) {
      return { totalProjects: 0, totalSize: 0 };
    }
  }

  // Clear all projects
  clearAllProjects(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear projects:', error);
      return false;
    }
  }

  // Generate project ID
  generateProjectId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate element ID
  generateElementId(): string {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateProject(project: any): boolean {
    return (
      project &&
      typeof project === 'object' &&
      project.name &&
      project.canvasState &&
      Array.isArray(project.canvasState.elements)
    );
  }
}

// Export singleton instance
export const canvasStorageService = new CanvasStorageService();
export default canvasStorageService;
