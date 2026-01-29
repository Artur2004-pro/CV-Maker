import { CVProject, CanvasState, ImageElement } from '../types/canvas';

class CanvasStorageService {
  private readonly STORAGE_KEY = 'cv_canvas_projects';
  private readonly MAX_PROJECTS = 50; // Maximum number of projects to keep
  private readonly MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit (localStorage is usually 5-10MB)

  // Save a CV project
  saveProject(project: CVProject): void {
    try {
      // Check storage quota before saving
      this.ensureStorageSpace();
      
      // Check project size first and optimize if needed
      let projectSize = new Blob([JSON.stringify(project)]).size;
      if (projectSize > this.MAX_STORAGE_SIZE) {
        console.warn('Project is too large, optimizing...');
        project = this.optimizeProject(project);
        projectSize = new Blob([JSON.stringify(project)]).size;
        
        if (projectSize > this.MAX_STORAGE_SIZE * 0.9) {
          throw new Error(`Project is too large (${Math.round(projectSize / 1024)}KB). Please reduce the size of images or export the project as a file.`);
        }
      }
      
      const existingProjects = this.getAllProjects();
      const projectIndex = existingProjects.findIndex(p => p.id === project.id);
      
      if (projectIndex >= 0) {
        existingProjects[projectIndex] = project;
      } else {
        existingProjects.push(project);
      }
      
      // Try to save, if quota exceeded, cleanup and retry
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingProjects));
      } catch (error: any) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
          // Cleanup old projects and retry with iterative approach
          console.warn('Storage quota exceeded, cleaning up old projects...');
          
          // Try aggressive cleanup - start with keeping fewer projects
          let keepCount = Math.max(1, Math.floor(this.MAX_PROJECTS / 2));
          let cleanupSuccess = false;
          let attempts = 0;
          const maxAttempts = 5;
          
          while (!cleanupSuccess && attempts < maxAttempts) {
            cleanupSuccess = this.cleanupOldProjects(keepCount);
            
            if (cleanupSuccess) {
              // Check if we have enough space now
              const stats = this.getStorageStats();
              const estimatedNewSize = stats.totalSize + projectSize;
              
              // If still too large, reduce keepCount further
              if (estimatedNewSize > this.MAX_STORAGE_SIZE * 0.9) {
                keepCount = Math.max(1, Math.floor(keepCount / 2));
                attempts++;
                cleanupSuccess = false;
                continue;
              }
            } else {
              // If cleanup failed, try keeping even fewer projects
              keepCount = Math.max(1, Math.floor(keepCount / 2));
              attempts++;
            }
          }
          
          // Retry saving after cleanup
          const retryProjects = this.getAllProjects();
          const retryIndex = retryProjects.findIndex(p => p.id === project.id);
          if (retryIndex >= 0) {
            retryProjects[retryIndex] = project;
          } else {
            retryProjects.push(project);
          }
          
          // Try saving again
          try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(retryProjects));
          } catch (retryError: any) {
            // If still failing, clear everything and save only current project
            if (retryError.name === 'QuotaExceededError' || retryError.code === 22) {
              console.warn('Still quota exceeded, clearing all storage and saving only current project...');
              
              // Completely clear localStorage for this key
              try {
                localStorage.removeItem(this.STORAGE_KEY);
              } catch (clearError) {
                console.warn('Failed to clear storage:', clearError);
              }
              
              // Try saving optimized project
              const finalProject = this.optimizeProject(project);
              const finalProjectSize = new Blob([JSON.stringify(finalProject)]).size;
              
              if (finalProjectSize > this.MAX_STORAGE_SIZE * 0.95) {
                throw new Error(`Project is too large (${Math.round(finalProjectSize / 1024)}KB) even after optimization. Please export the project as a file or reduce image sizes.`);
              }
              
              // Try saving single optimized project
              try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify([finalProject]));
              } catch (finalError: any) {
                if (finalError.name === 'QuotaExceededError' || finalError.code === 22) {
                  // Last resort: check if localStorage itself is full
                  const availableSpace = this.getAvailableStorageSpace();
                  throw new Error(`Storage quota exceeded. Project size: ${Math.round(finalProjectSize / 1024)}KB, Available: ${Math.round(availableSpace / 1024)}KB. Please clear browser storage or export the project as a file.`);
                }
                throw finalError;
              }
            } else {
              throw retryError;
            }
          }
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Failed to save project:', error);
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        throw new Error('Storage quota exceeded. Please delete some old projects or clear your browser storage.');
      }
      // Re-throw custom error messages
      if (error.message && error.message.includes('too large')) {
        throw error;
      }
      throw new Error('Failed to save project');
    }
  }

  // Ensure there's enough storage space
  private ensureStorageSpace(): void {
    try {
      const stats = this.getStorageStats();
      
      // If storage is getting full, cleanup old projects proactively
      if (stats.totalSize > this.MAX_STORAGE_SIZE * 0.7) {
        console.warn('Storage is getting full, cleaning up old projects...');
        // Cleanup more aggressively if storage is very full
        const targetKeepCount = stats.totalSize > this.MAX_STORAGE_SIZE * 0.9 
          ? Math.max(1, Math.floor(this.MAX_PROJECTS / 2))
          : this.MAX_PROJECTS;
        this.cleanupOldProjects(targetKeepCount);
      }
      
      // If too many projects, keep only the most recent ones
      if (stats.totalProjects > this.MAX_PROJECTS) {
        this.cleanupOldProjects(this.MAX_PROJECTS);
      }
    } catch (error) {
      console.error('Error ensuring storage space:', error);
      // If ensureStorageSpace fails, try to clear some space anyway
      try {
        this.cleanupOldProjects(Math.max(1, Math.floor(this.MAX_PROJECTS / 2)));
      } catch (cleanupError) {
        console.error('Failed to cleanup during ensureStorageSpace:', cleanupError);
      }
    }
  }

  // Cleanup old projects, keeping only the most recent ones
  // Returns true if cleanup was successful, false otherwise
  private cleanupOldProjects(keepCount: number = this.MAX_PROJECTS): boolean {
    try {
      const projects = this.getAllProjects();
      
      if (projects.length <= keepCount) {
        return true; // No cleanup needed
      }
      
      // Sort by lastModified date (newest first)
      const sortedProjects = [...projects].sort((a, b) => 
        b.lastModified.getTime() - a.lastModified.getTime()
      );
      
      // Keep only the most recent projects
      const projectsToKeep = sortedProjects.slice(0, keepCount);
      
      // Try to save the cleaned up list
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projectsToKeep));
        console.log(`Cleaned up ${projects.length - projectsToKeep.length} old projects`);
        return true;
      } catch (error: any) {
        // If still quota exceeded, try keeping even fewer projects
        if (error.name === 'QuotaExceededError' || error.code === 22) {
          console.warn('Still quota exceeded after cleanup, trying more aggressive cleanup...');
          // Try keeping only half of the requested amount
          const newKeepCount = Math.max(1, Math.floor(keepCount / 2));
          if (newKeepCount < keepCount) {
            return this.cleanupOldProjects(newKeepCount);
          }
          // If even 1 project is too much, clear everything
          console.warn('Storage completely full, clearing all projects...');
          localStorage.removeItem(this.STORAGE_KEY);
          return true;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error cleaning up old projects:', error);
      return false;
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
      
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));
      } catch (error: any) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
          // This shouldn't happen when deleting, but handle it anyway
          console.error('Unexpected quota error when deleting project');
          return false;
        }
        throw error;
      }
      
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

  // Optimize project by removing large data (thumbnails, history, etc.)
  private optimizeProject(project: CVProject): CVProject {
    const optimized: CVProject = {
      ...project,
      // Remove thumbnail if it's a large data URL
      thumbnail: project.thumbnail && project.thumbnail.length > 50000 
        ? undefined 
        : project.thumbnail,
      canvasState: {
        ...project.canvasState,
        // Remove history to save space
        history: [],
        historyIndex: 0,
        // Optimize elements - remove large image data URLs
        elements: project.canvasState.elements.map(element => {
          if (element.type === 'image') {
            const imageElement = element as ImageElement;
            // If image is a large data URL, replace with placeholder
            if (imageElement.src && imageElement.src.startsWith('data:image') && imageElement.src.length > 100000) {
              return {
                ...imageElement,
                src: '', // Remove large image data
              } as ImageElement;
            }
          }
          return element;
        }),
      },
    };
    return optimized;
  }

  // Get available storage space (approximate)
  private getAvailableStorageSpace(): number {
    try {
      let totalSize = 0;
      // Calculate total localStorage size
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += key.length + value.length;
        }
      }
      // Estimate available space (localStorage is usually 5-10MB)
      const estimatedTotal = 5 * 1024 * 1024; // 5MB
      return Math.max(0, estimatedTotal - totalSize);
    } catch (error) {
      console.error('Failed to calculate available storage:', error);
      return 0;
    }
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
