// Backend API Response Format (matches APIResponse helper)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Auth Types (matches backend LoginRequest/SignupRequest schemas)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// CV Data Types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'professional';
  isPremium: boolean;
}

// PDF Generation Types
export interface PDFGenerateRequest {
  cvData: CVData;
  templateId: string;
  options?: {
    format?: 'A4' | 'Letter';
    margins?: number;
    includePhoto?: boolean;
  };
}
