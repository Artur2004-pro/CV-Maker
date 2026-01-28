import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalIcons } from '../ui/IconSystem';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { ProInput } from '../ui/ProInput';
import { fileUploadService } from '../../services/fileUploadService';
import type { CVData } from '../../types/api';
import toast from 'react-hot-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  extractedData?: any;
  parsedCV?: any;
}

interface ParsedCVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
  }>;
  skills: string[];
}

const ProfessionalUploadCV: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedCV, setParsedCV] = useState<ParsedCVData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processPDFFile = useCallback(async (fileObj: UploadedFile, file: File) => {
    try {
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'processing', progress: 50 }
          : f
      ));

      // Upload and parse PDF file
      console.log('[ProfessionalUploadCV] Starting PDF upload for file:', file.name, file.type, file.size);
      const result = await fileUploadService.uploadCVFile(file);
      
      console.log('[ProfessionalUploadCV] Upload result:', {
        success: result.success,
        hasCvData: !!result.cvData,
        error: result.error,
        cvDataKeys: result.cvData ? Object.keys(result.cvData) : null
      });
      
      if (result.success && result.cvData) {
        console.log('[ProfessionalUploadCV] CV Data structure:', {
          personalInfo: result.cvData.personalInfo,
          experienceCount: result.cvData.experience?.length || 0,
          educationCount: result.cvData.education?.length || 0,
          skillsCount: result.cvData.skills?.length || 0
        });
        // Convert CVData to ParsedCVData format for display
        const parsedCV: ParsedCVData = {
          personalInfo: {
            fullName: `${result.cvData.personalInfo.firstName || ''} ${result.cvData.personalInfo.lastName || ''}`.trim() || 'Unknown',
            email: result.cvData.personalInfo.email || '',
            phone: result.cvData.personalInfo.phone || '',
            location: result.cvData.personalInfo.location || '',
            summary: result.cvData.personalInfo.summary || ''
          },
          experience: result.cvData.experience.map(exp => ({
            title: exp.position || '',
            company: exp.company || '',
            duration: `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`.trim(),
            description: exp.description || ''
          })),
          education: result.cvData.education.map(edu => ({
            degree: edu.degree || '',
            institution: edu.school || '',
            duration: `${edu.startDate || ''} - ${edu.current ? 'Present' : edu.endDate || ''}`.trim()
          })),
          skills: result.cvData.skills.map(skill => skill.name || '').filter(Boolean)
        };

        setParsedCV(parsedCV);
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'completed', parsedCV, extractedData: result.extractedData }
            : f
        ));
        
        // Auto-navigate to editor after successful import
        console.log('[ProfessionalUploadCV] PDF processed successfully, navigating to editor with cvData:', result.cvData);
        console.log('[ProfessionalUploadCV] Navigation state will be:', {
          cvData: result.cvData,
          templateId: undefined,
          autoEdit: true
        });
        
        // Store CV data in sessionStorage as backup
        try {
          sessionStorage.setItem('pending_cv_data', JSON.stringify(result.cvData));
          console.log('[ProfessionalUploadCV] CV data stored in sessionStorage');
        } catch (storageError) {
          console.warn('[ProfessionalUploadCV] Failed to store in sessionStorage:', storageError);
        }
        
        // Navigate immediately - navigate synchronously
        console.log('[ProfessionalUploadCV] About to navigate to /editor');
        console.log('[ProfessionalUploadCV] Navigation function:', typeof navigate);
        console.log('[ProfessionalUploadCV] CV Data to pass:', {
          hasCvData: !!result.cvData,
          personalInfo: result.cvData?.personalInfo,
          experienceCount: result.cvData?.experience?.length,
          educationCount: result.cvData?.education?.length,
          skillsCount: result.cvData?.skills?.length
        });
        
        try {
          const navigationState = { 
            cvData: result.cvData,
            templateId: undefined, // Will use default template
            autoEdit: true // Flag to indicate auto-edit mode
          };
          
          console.log('[ProfessionalUploadCV] Calling navigate with state:', navigationState);
          
          // Use both navigation methods for reliability
          navigate('/editor', { 
            state: navigationState,
            replace: false // Allow back navigation
          });
          
          console.log('[ProfessionalUploadCV] Navigation called successfully');
          
          // Show success message
          toast.success(`Successfully processed ${fileObj.name}. Opening editor...`, { duration: 2000 });
          
        } catch (error) {
          console.error('[ProfessionalUploadCV] Navigation error:', error);
          toast.error('Failed to navigate to editor. Please try again.');
        }
      } else {
        throw new Error(result.error || 'Failed to parse PDF');
      }
    } catch (error: any) {
      console.error('Error processing PDF:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'error', error: error.message }
          : f
      ));
      toast.error(`Failed to process ${fileObj.name}: ${error.message}`);
    }
  }, [navigate]);

  const simulateProcessing = useCallback((fileObj: UploadedFile) => {
    // Simulate CV parsing for non-PDF files (legacy behavior)
    setTimeout(() => {
      const mockParsedCV: ParsedCVData = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          summary: 'Experienced software engineer with expertise in full-stack development and cloud architecture.'
        },
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Company Inc.',
            duration: '2020 - Present',
            description: 'Led development of enterprise applications using React, Node.js, and AWS.'
          },
          {
            title: 'Software Developer',
            company: 'Startup Corp',
            duration: '2018 - 2020',
            description: 'Developed and maintained web applications for various clients.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            duration: '2014 - 2018'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL']
      };

      setParsedCV(mockParsedCV);
      
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'completed', parsedCV: mockParsedCV }
          : f
      ));
      
      toast.success(`Successfully processed ${fileObj.name}`);
    }, 2000);
  }, []);

  const simulateUpload = useCallback((fileObj: UploadedFile, index: number) => {
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        // Update file status to processing
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'processing', progress: 100 }
            : f
        ));
        
        // Simulate processing
        setTimeout(() => {
          simulateProcessing(fileObj);
        }, 1000);
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, progress }
            : f
        ));
      }
    }, 200);
  }, [simulateProcessing]);

  const processFiles = useCallback((fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                           file.type === 'application/msword' || 
                           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                           file.type === 'text/plain';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Please upload PDF, DOC, DOCX, or TXT files.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Process files - PDF files will auto-open editor
    newFiles.forEach((fileObj, index) => {
      const file = validFiles[index];
      
      // For PDF files, process directly and auto-open editor
      if (file.type === 'application/pdf') {
        processPDFFile(fileObj, file);
      } else {
        // For other file types, simulate upload (legacy behavior)
        simulateUpload(fileObj, index);
      }
    });
  }, [processPDFFile, simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type === 'application/pdf') return '📄';
    if (type.includes('word')) return '📝';
    if (type === 'text/plain') return '📄';
    return '📎';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <ProfessionalIcons.LoadingIcon size="sm" />;
      case 'processing':
        return <ProfessionalIcons.LoadingIcon size="sm" />;
      case 'completed':
        return <ProfessionalIcons.SuccessIcon size="sm" />;
      case 'error':
        return <ProfessionalIcons.ErrorIcon size="sm" />;
      default:
        return <ProfessionalIcons.InfoIcon size="sm" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'processing':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const handleUseParsedCV = () => {
    if (parsedCV) {
      toast.success('CV data imported successfully! Redirecting to editor...');
      // Navigate to CV editor with parsed data
      setTimeout(() => {
        navigate('/editor', { state: { cvData: parsedCV } });
      }, 1500);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setParsedCV(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.UploadIcon size="md" color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload Existing CV</h1>
                <p className="text-sm text-gray-600">Import your current CV and enhance it</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {parsedCV && (
                <ProButton
                  onClick={handleUseParsedCV}
                  variant="primary"
                  className="shadow-lg hover:shadow-xl"
                >
                  <ProfessionalIcons.EditIcon size="sm" />
                  <span className="ml-2">Use This CV</span>
                </ProButton>
              )}
              <ProButton
                onClick={clearAll}
                variant="outline"
                className="border-gray-300 text-gray-700"
                disabled={files.length === 0}
              >
                <ProfessionalIcons.TrashIcon size="sm" />
                <span className="ml-2">Clear All</span>
              </ProButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <ProCard variant="elevated" className="p-8 border-0 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your CV</h2>
                <p className="text-gray-600">
                  Upload your existing CV to get started. We support PDF, DOC, DOCX, and TXT files.
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <ProfessionalIcons.UploadIcon 
                      size="lg" 
                      className={isDragOver ? 'text-blue-600' : 'text-gray-400'}
                    />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {isDragOver ? 'Drop your files here' : 'Drag & drop your CV files here'}
                    </p>
                    <p className="text-gray-600 text-sm">or click to browse</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ProfessionalIcons.FileTextIcon size="sm" />
                      <span>PDF</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ProfessionalIcons.FileTextIcon size="sm" />
                      <span>DOC</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ProfessionalIcons.FileTextIcon size="sm" />
                      <span>TXT</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <ProfessionalIcons.AlertTriangleIcon size="sm" />
                    <span>Max file size: 10MB</span>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                  
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        getStatusColor(file.status)
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getFileIcon(file.type)}</div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className="text-sm font-medium capitalize">
                            {file.status}
                          </span>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="w-32">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{file.progress}%</p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={file.status === 'processing'}
                        >
                          <ProfessionalIcons.TrashIcon size="sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ProCard>
          </div>

          {/* Parsed CV Preview */}
          <div className="lg:col-span-1">
            {parsedCV ? (
              <ProCard variant="elevated" className="p-6 border-0 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Parsed CV Data</h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ProfessionalIcons.ViewIcon size="sm" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Personal Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm"><strong>Name:</strong> {parsedCV.personalInfo.fullName}</p>
                      <p className="text-sm"><strong>Email:</strong> {parsedCV.personalInfo.email}</p>
                      <p className="text-sm"><strong>Phone:</strong> {parsedCV.personalInfo.phone}</p>
                      <p className="text-sm"><strong>Location:</strong> {parsedCV.personalInfo.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Experience</h4>
                    <div className="space-y-2">
                      {parsedCV.experience.slice(0, 2).map((exp, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{exp.title}</p>
                          <p className="text-xs text-gray-600">{exp.company} • {exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedCV.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <ProButton
                    onClick={handleUseParsedCV}
                    variant="primary"
                    className="w-full shadow-lg hover:shadow-xl"
                  >
                    <ProfessionalIcons.EditIcon size="sm" />
                    <span className="ml-2">Use This CV</span>
                  </ProButton>
                </div>
              </ProCard>
            ) : (
              <ProCard variant="elevated" className="p-6 border-0 shadow-xl">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ProfessionalIcons.FileTextIcon size="lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No CV Data Yet</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload your CV to see parsed information here
                  </p>
                  <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600"><strong>What we extract:</strong></p>
                    <ul className="text-xs text-gray-600 space-y-1 mt-2">
                      <li>• Personal information</li>
                      <li>• Work experience</li>
                      <li>• Education details</li>
                      <li>• Skills and competencies</li>
                    </ul>
                  </div>
                </div>
              </ProCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalUploadCV;
