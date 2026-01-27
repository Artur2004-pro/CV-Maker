import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Upload, FileText, Save, Download, Eye, ArrowLeft, ArrowRight,
  Plus, Trash2, Edit3, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import { cvDataService } from '../../services/cvDataService';
import { fileUploadService } from '../../services/fileUploadService';
import { generatePDF } from '../../utils/pdfGenerator';
import { apiClient } from '../../services/apiClient';
import type { CVData, PersonalInfo, Experience, Education, Skill } from '../../types/api';
import toast from 'react-hot-toast';

export const CVEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user, isAuthenticated } = useAuth();
  
  const [cvData, setCvData] = useState<CVData>(cvDataService.getDefaultCVData());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills' | 'preview'>('personal');
  const [isPreview, setIsPreview] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Initialize CV data
  useEffect(() => {
    const initializeCV = async () => {
      setIsLoading(true);
      
      try {
        // Check for draft first
        const draft = cvDataService.loadDraft();
        if (draft) {
          setCvData(draft);
          setHasDraft(true);
          toast.success('Draft restored');
        } else {
          // Load from backend
          const loadedData = await cvDataService.loadCVData();
          if (loadedData) {
            setCvData(loadedData);
          }
        }
        
        // Check for template parameter
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('template');
        if (templateId) {
          setSelectedTemplate(templateId);
          // Load template data
          await loadTemplate(templateId);
        }
      } catch (error) {
        console.error('Error initializing CV:', error);
        toast.error('Failed to load CV data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCV();
  }, [id]);

  // Auto-save functionality
  useEffect(() => {
    if (!isPreview) {
      const cleanup = cvDataService.startAutoSave(cvData, (savedData) => {
        setCvData(savedData);
      });
      
      return cleanup;
    }
  }, [cvData, isPreview]);

  // Load template
  const loadTemplate = async (templateId: string) => {
    try {
      const response = await apiClient.get(`/templates/${templateId}`);
      if (response.success && response.data) {
        const templateData = (response.data as any).templateData;
        if (templateData && templateData.canvas) {
          // Convert template to CV data (this would be more complex in real implementation)
          const templateCVData = convertTemplateToCVData(templateData);
          setCvData(templateCVData);
          toast.success('Template loaded successfully');
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    }
  };

  // Convert template to CV data (simplified)
  const convertTemplateToCVData = (templateData: any): CVData => {
    const cvData = cvDataService.getDefaultCVData();
    
    // This would be a more complex conversion in real implementation
    // For now, we'll just return default data
    return cvData;
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await fileUploadService.uploadCVFile(file, (progress) => {
        setUploadProgress(progress.percentage);
      });
      
      if (result.success && result.cvData) {
        setCvData(result.cvData);
        setHasDraft(true);
        toast.success('CV uploaded and parsed successfully!');
        
        // Show extracted data if available
        if (result.extractedData) {
          console.log('Extracted data:', result.extractedData);
        }
      } else {
        throw new Error(result.error || 'Failed to upload file');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Update personal info
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  // Add experience
  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
    
    setHasDraft(true);
  }, []);

  // Update experience
  const updateExperience = useCallback((id: string, field: keyof Experience, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
    
    setHasDraft(true);
  }, []);

  // Delete experience
  const deleteExperience = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
    
    setHasDraft(true);
  }, []);

  // Add education
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    };
    
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
    
    setHasDraft(true);
  }, []);

  // Update education
  const updateEducation = useCallback((id: string, field: keyof Education, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
    
    setHasDraft(true);
  }, []);

  // Delete education
  const deleteEducation = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
    
    setHasDraft(true);
  }, []);

  // Add skill
  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: '',
      level: 'Intermediate',
    };
    
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    
    setHasDraft(true);
  }, []);

  // Update skill
  const updateSkill = useCallback((id: string, field: keyof Skill, value: any) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
    
    setHasDraft(true);
  }, []);

  // Delete skill
  const deleteSkill = useCallback((id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
    
    setHasDraft(true);
  }, []);

  // Save CV
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Validate CV data
      const validation = cvDataService.validateCVData(cvData);
      if (!validation.isValid) {
        toast.error('Please fix the following errors:\\n' + validation.errors.join('\\n'));
        return;
      }
      
      const success = await cvDataService.saveCVData(cvData);
      
      if (success) {
        setHasDraft(false);
        toast.success('CV saved successfully!');
      } else {
        toast.error('Failed to save CV to server, but saved locally');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save CV');
    } finally {
      setIsSaving(false);
    }
  }, [cvData]);

  // Download PDF
  const handleDownload = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Validate CV data
      const validation = cvDataService.validateCVData(cvData);
      if (!validation.isValid) {
        toast.error('Please fix the following errors:\\n' + validation.errors.join('\\n'));
        return;
      }
      
      await generatePDF(cvData, selectedTemplate || 'default', {
        format: 'A4',
        margins: 20,
        includePhoto: false,
      });
      
      toast.success('PDF downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  }, [cvData, selectedTemplate]);

  // Clear draft
  const clearDraft = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the draft? This cannot be undone.')) {
      cvDataService.clearDraft();
      setCvData(cvDataService.getDefaultCVData());
      setHasDraft(false);
      toast.success('Draft cleared');
    }
  }, []);

  // Get CV statistics
  const getCVStats = useCallback(() => {
    return cvDataService.getCVStats(cvData);
  }, [cvData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ProCard className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access the CV editor.</p>
            <ProButton onClick={() => navigate('/login')}>
              Go to Login
            </ProButton>
          </div>
        </ProCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ProButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </ProButton>
              <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
              {hasDraft && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  Draft
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <ProButton
                variant={isPreview ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </ProButton>
              <ProButton
                variant="outline"
                size="sm"
                onClick={clearDraft}
                disabled={!hasDraft}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Draft
              </ProButton>
              <ProButton
                loading={isSaving}
                onClick={handleSave}
                disabled={!hasDraft}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </ProButton>
              <ProButton
                loading={isLoading}
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <ProCard className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('personal')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'personal'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      👤
                    </div>
                    <span className="font-medium">Personal Info</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('experience')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'experience'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      💼
                    </div>
                    <span className="font-medium">Experience</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('education')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'education'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      🎓
                    </div>
                    <span className="font-medium">Education</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('skills')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'skills'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      ⚡
                    </div>
                    <span className="font-medium">Skills</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('preview')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'preview'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      👁
                    </div>
                    <span className="font-medium">Preview</span>
                  </div>
                </button>
              </nav>
              
              {/* Upload Section */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Upload CV</h3>
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {isUploading ? `Uploading... ${uploadProgress}%` : 'Click to upload CV'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, TXT, DOCX (Max 10MB)
                  </span>
                </label>
              </div>
              
              {/* CV Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">CV Statistics</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completeness:</span>
                    <span className="font-medium">{getCVStats().completeness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{getCVStats().experienceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Education:</span>
                    <span className="font-medium">{getCVStats().educationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-medium">{getCVStats().skillCount}</span>
                  </div>
                </div>
              </div>
            </ProCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isPreview ? (
              <ProCard className="p-8">
                <div className="bg-white p-8 shadow-lg">
                  {/* CV Preview */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                    </h2>
                    <p className="text-gray-600">
                      {cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}
                    </p>
                  </div>
                  
                  {cvData.personalInfo.summary && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                      <p className="text-gray-700">{cvData.personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {cvData.experience.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {cvData.education.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                          <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                          <p className="text-gray-600">{edu.school} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                          {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {cvData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill) => (
                          <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            {skill.name} ({skill.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ProCard>
            ) : (
              <div className="space-y-6">
                {activeSection === 'personal' && (
                  <ProCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProInput
                        label="First Name"
                        value={cvData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                      <ProInput
                        label="Last Name"
                        value={cvData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                      <ProInput
                        label="Email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                      />
                      <ProInput
                        label="Phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                      <ProInput
                        label="Location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="City, Country"
                      />
                      <ProInput
                        label="Website"
                        value={cvData.personalInfo.website}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                      <ProInput
                        label="LinkedIn"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="LinkedIn profile URL"
                      />
                      <ProInput
                        label="GitHub"
                        value={cvData.personalInfo.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        placeholder="GitHub profile URL"
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Summary
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={4}
                          value={cvData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                          placeholder="Write a brief summary about yourself..."
                        />
                      </div>
                    </div>
                  </ProCard>
                )}

                {activeSection === 'experience' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      <ProButton onClick={addExperience}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProInput
                              label="Position"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Job title"
                            />
                            <ProInput
                              label="Company"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company name"
                            />
                            <ProInput
                              label="Start Date"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              placeholder="MM/YYYY"
                            />
                            <ProInput
                              label="End Date"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="MM/YYYY or leave blank if current"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Currently working here</span>
                            </label>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                            />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <ProButton
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExperience(exp.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </ProButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}

                {activeSection === 'education' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                      <ProButton onClick={addEducation}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProInput
                              label="School"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                              placeholder="University/College name"
                            />
                            <ProInput
                              label="Degree"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="e.g., Bachelor's, Master's"
                            />
                            <ProInput
                              label="Field of Study"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              placeholder="e.g., Computer Science"
                            />
                            <ProInput
                              label="GPA (optional)"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="e.g., 3.8"
                            />
                            <ProInput
                              label="Start Date"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              placeholder="MM/YYYY"
                            />
                            <ProInput
                              label="End Date"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              placeholder="MM/YYYY or leave blank if current"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={edu.current}
                                onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Currently studying here</span>
                            </label>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <ProButton
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEducation(edu.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </ProButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}

                {activeSection === 'skills' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <ProButton onClick={addSkill}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-4">
                          <ProInput
                            label="Skill Name"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="e.g., JavaScript, Project Management"
                            className="flex-1"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <ProButton
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSkill(skill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </ProButton>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEditorPage;
