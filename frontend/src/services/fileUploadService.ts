import { cvDataService } from './cvDataService';
import type { CVData } from '../types/api';

interface UploadResult {
  success: boolean;
  cvData?: CVData;
  error?: string;
  extractedData?: any;
}

interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileUploadService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly SUPPORTED_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // Upload and parse CV file
  async uploadCVFile(file: File, onProgress?: (progress: FileUploadProgress) => void): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Read file
      const fileContent = await this.readFile(file, onProgress);
      
      // Parse based on file type
      let cvData: CVData | null = null;
      let extractedData: any = null;

      if (file.type === 'application/pdf') {
        if (fileContent instanceof ArrayBuffer) {
          const result = await this.parsePDF(fileContent);
          cvData = result.cvData;
          extractedData = result.extractedData;
        }
      } else if (file.type === 'text/plain') {
        if (typeof fileContent === 'string') {
          cvData = this.parseText(fileContent);
        }
      } else if (file.type.includes('word')) {
        if (fileContent instanceof ArrayBuffer) {
          cvData = await this.parseWord(fileContent);
        }
      }

      if (!cvData) {
        return {
          success: false,
          error: 'Failed to parse file content',
        };
      }

      // Save parsed data
      cvDataService.saveDraft(cvData);

      return {
        success: true,
        cvData,
        extractedData,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      };
    }
  }

  // Validate file
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Check file type
    if (!this.SUPPORTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Unsupported file type. Please upload PDF, TXT, or DOCX files',
      };
    }

    return { valid: true };
  }

  // Read file content
  private readFile(file: File, onProgress?: (progress: FileUploadProgress) => void): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: FileUploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: (event.loaded / event.total) * 100,
          };
          onProgress(progress);
        }
      };

      reader.onload = () => {
        resolve(reader.result as string | ArrayBuffer);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Choose reading method based on file type
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  // Parse PDF file (basic implementation)
  private async parsePDF(arrayBuffer: ArrayBuffer): Promise<{ cvData: CVData; extractedData: any }> {
    try {
      // This is a simplified PDF parser
      // In a real implementation, you would use a library like pdf-parse or pdf.js
      
      const cvData = cvDataService.getDefaultCVData();
      const extractedData: any = {
        text: '',
        metadata: {},
        fields: {},
      };

      // For demo purposes, we'll extract some basic text from the PDF
      // In production, you would use a proper PDF parsing library
      const text = this.extractTextFromPDF(arrayBuffer);
      extractedData.text = text;
      
      // Try to extract structured information
      const structuredData = this.extractStructuredData(text);
      
      // Populate CV data with extracted information
      if (structuredData.email) {
        cvData.personalInfo.email = structuredData.email;
      }
      if (structuredData.phone) {
        cvData.personalInfo.phone = structuredData.phone;
      }
      if (structuredData.name) {
        const nameParts = structuredData.name.split(' ');
        cvData.personalInfo.firstName = nameParts[0] || '';
        cvData.personalInfo.lastName = nameParts.slice(1).join(' ') || '';
      }
      if (structuredData.summary) {
        cvData.personalInfo.summary = structuredData.summary;
      }
      
      // Extract experience
      if (structuredData.experience && structuredData.experience.length > 0) {
        cvData.experience = structuredData.experience.map((exp: any, index: number) => ({
          id: `exp-${index}`,
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current || false,
          description: exp.description || '',
        }));
      }
      
      // Extract education
      if (structuredData.education && structuredData.education.length > 0) {
        cvData.education = structuredData.education.map((edu: any, index: number) => ({
          id: `edu-${index}`,
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
        }));
      }
      
      // Extract skills
      if (structuredData.skills && structuredData.skills.length > 0) {
        cvData.skills = structuredData.skills.map((skill: any, index: number) => ({
          id: `skill-${index}`,
          name: skill.name || '',
          level: skill.level || 'Intermediate',
        }));
      }

      return { cvData, extractedData };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  // Extract text from PDF (simplified)
  private extractTextFromPDF(arrayBuffer: ArrayBuffer): string {
    // This is a very basic implementation
    // In production, you would use a proper PDF parsing library
    try {
      // Convert ArrayBuffer to string (this won't work for real PDFs)
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(arrayBuffer);
      
      // Extract readable text (very basic pattern matching)
      const readableText = text.replace(/[^\x20-\x7E]/g, '').substring(0, 10000);
      
      return readableText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return '';
    }
  }

  // Extract structured data from text
  private extractStructuredData(text: string): any {
    const data: any = {
      name: '',
      email: '',
      phone: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
    };

    // Extract email
    const emailMatch = text.match(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g);
    if (emailMatch) {
      data.email = emailMatch[0];
    }

    // Extract phone (basic pattern)
    const phoneMatch = text.match(/\\b(?:\\+?1[-.\\s]?)?\\(?:(?:\\(?=\\d{3})\\d{3})[-.\\s]?\\d{4}|\\(?=\\d{2})\\d{2}[-.\\s]?\\d{4}|\\d{3}[-.\\s]?\\d{4})\\b/g);
    if (phoneMatch) {
      data.phone = phoneMatch[0];
    }

    // Extract name (basic pattern - looks for capitalized words at start)
    const nameMatch = text.match(/^[A-Z][a-z]+\\s+[A-Z][a-z]+/m);
    if (nameMatch) {
      data.name = nameMatch[0];
    }

    // Extract experience (basic pattern)
    const experienceSection = text.match(/Experience[:\\s\\S\\s]([\\s\\S]*?)(?=Education|Skills|$)/i);
    if (experienceSection) {
      const experienceText = experienceSection[1];
      const experienceMatches = experienceText.match(/([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)\\s+at\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)/g);
      
      if (experienceMatches) {
        data.experience = experienceMatches.map((match: string, index: number) => {
          const parts = match.split(' at ');
          return {
            position: parts[0] || '',
            company: parts[1] || '',
            description: '',
          };
        });
      }
    }

    // Extract skills (basic pattern)
    const skillsSection = text.match(/Skills?[:\\s\\S\\s]([\\s\\S]*?)(?=Experience|Education|$)/i);
    if (skillsSection) {
      const skillsText = skillsSection[1];
      const skillMatches = skillsText.match(/\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)\\b/g);
      
      if (skillMatches) {
        data.skills = skillMatches.map((skill: string) => ({
          name: skill,
          level: 'Intermediate',
        }));
      }
    }

    return data;
  }

  // Parse text file
  private parseText(text: string): CVData | null {
    try {
      return cvDataService.importCVData(text, 'txt');
    } catch (error) {
      console.error('Error parsing text file:', error);
      return null;
    }
  }

  // Parse Word document (basic implementation)
  private async parseWord(arrayBuffer: ArrayBuffer): Promise<CVData | null> {
    try {
      // This is a simplified implementation
      // In production, you would use a library like mammoth.js
      
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(arrayBuffer);
      
      // Extract text and parse as CV data
      return cvDataService.importCVData(text, 'txt');
    } catch (error) {
      console.error('Error parsing Word document:', error);
      return null;
    }
  }

  // Generate file preview
  generateFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to generate preview'));
      };
      
      // For text files, read as text
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other files, create a simple preview
        resolve(`File: ${file.name}\\nType: ${file.type}\\nSize: ${this.formatFileSize(file.size)}`);
      }
    });
  }

  // Format file size
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file type icon
  getFileTypeIcon(fileType: string): string {
    if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType === 'text/plain') {
      return '📝';
    } else if (fileType.includes('word')) {
      return '📄';
    } else {
      return '📎';
    }
  }

  // Check if file is supported
  isFileSupported(file: File): boolean {
    return this.SUPPORTED_TYPES.includes(file.type) && file.size <= this.MAX_FILE_SIZE;
  }

  // Get supported file types
  getSupportedFileTypes(): string[] {
    return this.SUPPORTED_TYPES;
  }

  // Get max file size
  getMaxFileSize(): number {
    return this.MAX_FILE_SIZE;
  }

  // Simple upload method for dashboard component
  async uploadCV(file: File, onProgress?: (progress: number) => void): Promise<void> {
    const result = await this.uploadCVFile(file, (progress) => {
      onProgress?.(progress.percentage);
    });

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
  }
}

// Create singleton instance
export const fileUploadService = new FileUploadService();

// Export types
export type { FileUploadService, UploadResult, FileUploadProgress };
