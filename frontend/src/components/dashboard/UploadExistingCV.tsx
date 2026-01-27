import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { fileUploadService } from '../../services/fileUploadService';
import toast from 'react-hot-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export const UploadExistingCV: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  }, []);

  const handleFiles = async (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB
    });

    if (validFiles.length === 0) {
      toast.error('Please select valid CV files (PDF, DOC, DOCX, TXT) under 10MB');
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Upload files one by one
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileRecord = newFiles[i];
      
      try {
        await fileUploadService.uploadCV(file, (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileRecord.id 
              ? { ...f, progress }
              : f
          ));
        });

        setFiles(prev => prev.map(f => 
          f.id === fileRecord.id 
            ? { ...f, status: 'success' }
            : f
        ));

        toast.success(`${file.name} uploaded successfully!`);
      } catch (error: any) {
        setFiles(prev => prev.map(f => 
          f.id === fileRecord.id 
            ? { ...f, status: 'error', error: error.message }
            : f
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
  };

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    return '📄';
  };

  return (
    <ProCard variant="elevated" className="p-6 shadow-xl border-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Existing CV</h2>
        <p className="text-gray-600">
          Upload your existing CV to get started quickly. Supports PDF, DOC, DOCX, and TXT files.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
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
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 text-blue-600 transition-transform duration-300 ${
              isDragOver ? 'scale-110' : ''
            }`} />
          </div>
          
          <div>
            <p className="text-gray-900 font-medium mb-1">
              {isDragOver ? 'Drop your files here' : 'Drag & drop your CV files here'}
            </p>
            <p className="text-gray-600 text-sm">or click to browse</p>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>Max file size: 10MB • PDF, DOC, DOCX, TXT</span>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-gray-900 font-medium mb-3">Uploaded Files</h3>
          
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                file.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : file.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div>
                  <p className="text-gray-900 font-medium">{file.name}</p>
                  <p className="text-gray-600 text-sm">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {file.status === 'uploading' && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-gray-600 text-sm">
                      {file.progress || 0}%
                    </span>
                  </div>
                )}
                
                {file.status === 'success' && (
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">Uploaded</span>
                  </div>
                )}
                
                {file.status === 'error' && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 text-sm font-medium">Failed</span>
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="mt-6 flex justify-end space-x-3">
          <ProButton
            variant="outline"
            onClick={() => setFiles([])}
            disabled={isUploading}
            className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900"
          >
            Clear All
          </ProButton>
          
          <ProButton
            disabled={files.some(f => f.status !== 'success') || isUploading}
            variant="primary"
            className="shadow-lg hover:shadow-xl"
          >
            Process CVs
          </ProButton>
        </div>
      )}
    </ProCard>
  );
};

export default UploadExistingCV;
