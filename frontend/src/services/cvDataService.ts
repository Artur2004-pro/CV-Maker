import { apiClient } from './apiClient';
import type { CVData, PersonalInfo, Experience, Education, Skill, Language, Certificate } from '../types/api';

class CVDataService {
  private readonly STORAGE_KEY = 'cv_maker_cv_data';
  private readonly DRAFT_KEY = 'cv_maker_cv_draft';
  private readonly BACKUP_KEY = 'cv_maker_cv_backup';

  // Save CV data to localStorage and backend
  async saveCVData(cvData: CVData): Promise<boolean> {
    try {
      // Save to localStorage first
      this.saveToLocalStorage(cvData);
      
      // Create backup
      this.createBackup(cvData);
      
      // Save to backend
      const response = await apiClient.post('/cv/save', cvData);
      
      if (response.success) {
        // Clear draft after successful save
        localStorage.removeItem(this.DRAFT_KEY);
        return true;
      } else {
        throw new Error(response.error || 'Failed to save CV data');
      }
    } catch (error) {
      console.error('Error saving CV data:', error);
      // Keep in localStorage as fallback
      return false;
    }
  }

  // Load CV data from backend or localStorage
  async loadCVData(): Promise<CVData | null> {
    try {
      // Try to load from backend first
      const response = await apiClient.get('/cv/load');
      
      if (response.success && response.data) {
        const cvData = response.data as CVData;
        // Save to localStorage as cache
        this.saveToLocalStorage(cvData);
        return cvData;
      }
    } catch (error) {
      console.log('Backend not available, loading from localStorage');
    }
    
    // Fallback to localStorage
    return this.loadFromLocalStorage();
  }

  // Save to localStorage
  private saveToLocalStorage(cvData: CVData): void {
    try {
      const data = {
        cvData,
        lastSaved: Date.now(),
        version: '1.0.0',
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Load from localStorage
  private loadFromLocalStorage(): CVData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      return data.cvData || null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // Save draft
  saveDraft(cvData: CVData): void {
    try {
      const draft = {
        cvData,
        lastModified: Date.now(),
        autoSave: true,
      };
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  // Load draft
  loadDraft(): CVData | null {
    try {
      const stored = localStorage.getItem(this.DRAFT_KEY);
      if (!stored) return null;

      const draft = JSON.parse(stored);
      return draft.cvData || null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }

  // Clear draft
  clearDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY);
  }

  // Has draft
  hasDraft(): boolean {
    return localStorage.getItem(this.DRAFT_KEY) !== null;
  }

  // Create backup
  private createBackup(cvData: CVData): void {
    try {
      const backup = {
        cvData,
        timestamp: Date.now(),
        version: '1.0.0',
      };
      
      // Keep only last 5 backups
      const backups = this.getBackups();
      backups.push(backup);
      
      if (backups.length > 5) {
        backups.shift(); // Remove oldest
      }
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  // Get backups
  getBackups(): Array<{ cvData: CVData; timestamp: number; version: string }> {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting backups:', error);
      return [];
    }
  }

  // Restore from backup
  restoreFromBackup(timestamp: number): CVData | null {
    try {
      const backups = this.getBackups();
      const backup = backups.find(b => b.timestamp === timestamp);
      
      if (backup) {
        this.saveToLocalStorage(backup.cvData);
        return backup.cvData;
      }
      
      return null;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return null;
    }
  }

  // Get default CV data structure
  getDefaultCVData(): CVData {
    return {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        website: '',
        linkedin: '',
        github: '',
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certificates: [],
    };
  }

  // Validate CV data
  validateCVData(cvData: CVData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate personal info
    if (!cvData.personalInfo.firstName.trim()) {
      errors.push('First name is required');
    }
    if (!cvData.personalInfo.lastName.trim()) {
      errors.push('Last name is required');
    }
    if (!cvData.personalInfo.email.trim()) {
      errors.push('Email is required');
    } else if (!/\\S+@\\S+\\.\\S+/.test(cvData.personalInfo.email)) {
      errors.push('Email is invalid');
    }
    if (!cvData.personalInfo.phone.trim()) {
      errors.push('Phone number is required');
    }
    if (!cvData.personalInfo.location.trim()) {
      errors.push('Location is required');
    }

    // Validate experience
    cvData.experience.forEach((exp, index) => {
      if (!exp.company.trim()) {
        errors.push(`Company is required for experience ${index + 1}`);
      }
      if (!exp.position.trim()) {
        errors.push(`Position is required for experience ${index + 1}`);
      }
      if (!exp.startDate.trim()) {
        errors.push(`Start date is required for experience ${index + 1}`);
      }
      if (!exp.current && !exp.endDate.trim()) {
        errors.push(`End date is required for experience ${index + 1}`);
      }
    });

    // Validate education
    cvData.education.forEach((edu, index) => {
      if (!edu.school.trim()) {
        errors.push(`School is required for education ${index + 1}`);
      }
      if (!edu.degree.trim()) {
        errors.push(`Degree is required for education ${index + 1}`);
      }
      if (!edu.field.trim()) {
        errors.push(`Field of study is required for education ${index + 1}`);
      }
      if (!edu.startDate.trim()) {
        errors.push(`Start date is required for education ${index + 1}`);
      }
      if (!edu.current && !edu.endDate.trim()) {
        errors.push(`End date is required for education ${index + 1}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Auto-save functionality
  startAutoSave(cvData: CVData, onSave?: (cvData: CVData) => void): () => void {
    let autoSaveTimeout: number;
    
    const autoSave = () => {
      this.saveDraft(cvData);
      if (onSave) {
        onSave(cvData);
      }
    };

    // Initial save
    autoSave();

    // Return cleanup function
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }

  // Export CV data
  exportCVData(cvData: CVData, format: 'json' | 'csv' | 'txt'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(cvData, null, 2);
      
      case 'csv':
        return this.convertToCSV(cvData);
      
      case 'txt':
        return this.convertToText(cvData);
      
      default:
        return JSON.stringify(cvData, null, 2);
    }
  }

  // Import CV data
  importCVData(data: string, format: 'json' | 'csv' | 'txt'): CVData | null {
    try {
      switch (format) {
        case 'json':
          return JSON.parse(data);
        
        case 'csv':
          return this.parseFromCSV(data);
        
        case 'txt':
          return this.parseFromText(data);
        
        default:
          return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error importing CV data:', error);
      return null;
    }
  }

  // Convert to CSV
  private convertToCSV(cvData: CVData): string {
    const lines: string[] = [];
    
    // Personal info
    lines.push('Personal Info');
    lines.push('First Name,Last Name,Email,Phone,Location,Summary,Website,LinkedIn,GitHub');
    lines.push([
      cvData.personalInfo.firstName,
      cvData.personalInfo.lastName,
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location,
      cvData.personalInfo.summary,
      cvData.personalInfo.website,
      cvData.personalInfo.linkedin,
      cvData.personalInfo.github,
    ].join(','));
    
    lines.push('');
    
    // Experience
    lines.push('Experience');
    lines.push('Company,Position,Start Date,End Date,Current,Description');
    cvData.experience.forEach(exp => {
      lines.push([
        exp.company,
        exp.position,
        exp.startDate,
        exp.endDate,
        exp.current,
        `"${exp.description.replace(/"/g, '""')}"`,
      ].join(','));
    });
    
    lines.push('');
    
    // Education
    lines.push('Education');
    lines.push('School,Degree,Field,Start Date,End Date,Current,GPA');
    cvData.education.forEach(edu => {
      lines.push([
        edu.school,
        edu.degree,
        edu.field,
        edu.startDate,
        edu.endDate,
        edu.current,
        edu.gpa || '',
      ].join(','));
    });
    
    lines.push('');
    
    // Skills
    lines.push('Skills');
    lines.push('Name,Level');
    cvData.skills.forEach(skill => {
      lines.push([skill.name, skill.level].join(','));
    });
    
    return lines.join('\\n');
  }

  // Convert to text
  private convertToText(cvData: CVData): string {
    const lines: string[] = [];
    
    // Personal info
    lines.push('PERSONAL INFORMATION');
    lines.push('==================');
    lines.push(`Name: ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`);
    lines.push(`Email: ${cvData.personalInfo.email}`);
    lines.push(`Phone: ${cvData.personalInfo.phone}`);
    lines.push(`Location: ${cvData.personalInfo.location}`);
    lines.push(`Website: ${cvData.personalInfo.website || 'N/A'}`);
    lines.push(`LinkedIn: ${cvData.personalInfo.linkedin || 'N/A'}`);
    lines.push(`GitHub: ${cvData.personalInfo.github || 'N/A'}`);
    lines.push('');
    lines.push('Summary:');
    lines.push(cvData.personalInfo.summary || 'No summary provided');
    lines.push('');
    
    // Experience
    lines.push('EXPERIENCE');
    lines.push('==========');
    cvData.experience.forEach((exp, index) => {
      lines.push(`${index + 1}. ${exp.position} at ${exp.company}`);
      lines.push(`   ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      lines.push(`   ${exp.description}`);
      lines.push('');
    });
    
    // Education
    lines.push('EDUCATION');
    lines.push('=========');
    cvData.education.forEach((edu, index) => {
      lines.push(`${index + 1}. ${edu.degree} in ${edu.field}`);
      lines.push(`   ${edu.school}`);
      lines.push(`   ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`);
      if (edu.gpa) {
        lines.push(`   GPA: ${edu.gpa}`);
      }
      lines.push('');
    });
    
    // Skills
    lines.push('SKILLS');
    lines.push('=====');
    cvData.skills.forEach(skill => {
      lines.push(`• ${skill.name} (${skill.level})`);
    });
    
    return lines.join('\\n');
  }

  // Parse from CSV (basic implementation)
  private parseFromCSV(csv: string): CVData | null {
    try {
      const lines = csv.split('\\n');
      const cvData: CVData = this.getDefaultCVData();
      
      let currentSection = '';
      let lineIndex = 0;
      
      for (const line of lines) {
        lineIndex++;
        
        if (line.trim() === '') continue;
        
        // Identify sections
        if (line.toLowerCase().includes('personal info')) {
          currentSection = 'personal';
          continue;
        } else if (line.toLowerCase().includes('experience')) {
          currentSection = 'experience';
          continue;
        } else if (line.toLowerCase().includes('education')) {
          currentSection = 'education';
          continue;
        }
        
        // Skip header lines
        if (line.includes('First Name') || line.includes('Company') || line.includes('School')) {
          continue;
        }
        
        // Parse data based on section
        if (currentSection === 'personal' && lineIndex === 3) {
          const parts = line.split(',');
          cvData.personalInfo = {
            firstName: parts[0] || '',
            lastName: parts[1] || '',
            email: parts[2] || '',
            phone: parts[3] || '',
            location: parts[4] || '',
            summary: parts[5] || '',
            website: parts[6] || '',
            linkedin: parts[7] || '',
            github: parts[8] || '',
          };
        }
      }
      
      return cvData;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return null;
    }
  }

  // Parse from text (basic implementation)
  private parseFromText(text: string): CVData | null {
    try {
      const lines = text.split('\\n');
      const cvData: CVData = this.getDefaultCVData();
      
      let currentSection = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed === '') continue;
        
        // Identify sections
        if (trimmed === 'PERSONAL INFORMATION' || trimmed === '==================') {
          currentSection = 'personal';
          continue;
        } else if (trimmed === 'EXPERIENCE' || trimmed === '==========') {
          currentSection = 'experience';
          continue;
        } else if (trimmed === 'EDUCATION' || trimmed === '=========') {
          currentSection = 'education';
          continue;
        } else if (trimmed === 'SKILLS' || trimmed === '=====') {
          currentSection = 'skills';
          continue;
        }
        
        // Parse data based on section
        if (currentSection === 'personal') {
          if (trimmed.startsWith('Name:')) {
            const name = trimmed.replace('Name:', '').trim();
            const [firstName, lastName] = name.split(' ');
            cvData.personalInfo.firstName = firstName || '';
            cvData.personalInfo.lastName = lastName || '';
          } else if (trimmed.startsWith('Email:')) {
            cvData.personalInfo.email = trimmed.replace('Email:', '').trim();
          } else if (trimmed.startsWith('Phone:')) {
            cvData.personalInfo.phone = trimmed.replace('Phone:', '').trim();
          } else if (trimmed.startsWith('Location:')) {
            cvData.personalInfo.location = trimmed.replace('Location:', '').trim();
          } else if (trimmed.startsWith('Summary:')) {
            cvData.personalInfo.summary = trimmed.replace('Summary:', '').trim();
          }
        }
      }
      
      return cvData;
    } catch (error) {
      console.error('Error parsing text:', error);
      return null;
    }
  }

  // Get CV statistics
  getCVStats(cvData: CVData): {
    totalElements: number;
    experienceCount: number;
    educationCount: number;
    skillCount: number;
    languageCount: number;
    certificateCount: number;
    completeness: number;
  } {
    const totalElements = 1 + cvData.experience.length + cvData.education.length + 
                          cvData.skills.length + cvData.languages.length + cvData.certificates.length;
    
    const requiredFields = [
      cvData.personalInfo.firstName,
      cvData.personalInfo.lastName,
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location,
    ];
    
    const filledRequiredFields = requiredFields.filter(field => field && field.trim() !== '').length;
    const completeness = (filledRequiredFields / requiredFields.length) * 100;
    
    return {
      totalElements,
      experienceCount: cvData.experience.length,
      educationCount: cvData.education.length,
      skillCount: cvData.skills.length,
      languageCount: cvData.languages.length,
      certificateCount: cvData.certificates.length,
      completeness: Math.round(completeness),
    };
  }
}

// Create singleton instance
export const cvDataService = new CVDataService();

// Export types
export type { CVDataService };
