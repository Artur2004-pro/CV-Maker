import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CVCanvasProvider, useCVCanvas } from '../../contexts/CVCanvasContext';
import CanvasEditor from '../../components/canvas/CanvasEditor';
import { useAuth } from '../../hooks/useAuth';
import { cvDataService } from '../../services/cvDataService';
import { apiClient } from '../../services/apiClient';
import { templatePresets, getTemplatePreset } from '../../data/template-presets';
import type { CVData } from '../../types/api';
import toast from 'react-hot-toast';

interface EditorLocationState {
  cvData?: CVData;
  templateId?: string;
}

/**
 * Inner component that handles template application after CVCanvasProvider is initialized
 */
const CanvasCVEditorContent: React.FC = () => {
  const { applyTemplate, cvData, templateId } = useCVCanvas();
  const [templateApplied, setTemplateApplied] = useState(false);

  useEffect(() => {
    if (!templateApplied && templateId) {
      const template = getTemplatePreset(templateId);
      if (template) {
        console.log('[CanvasCVEditorPage] Applying template on mount:', templateId);
        applyTemplate(template, cvData);
        setTemplateApplied(true);
      } else {
        console.warn('[CanvasCVEditorPage] Template not found:', templateId);
        toast.error(`Template "${templateId}" not found. Using default template.`);
      }
    }
  }, [templateId, cvData, applyTemplate, templateApplied]);

  return <CanvasEditor />;
};

const CanvasCVEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const state = (location.state || {}) as EditorLocationState;

  const [initialCVData, setInitialCVData] = useState<CVData | undefined>(undefined);
  const [initialTemplateId, setInitialTemplateId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load CV data if ID is provided
  useEffect(() => {
    const loadCVData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        let cvData: CVData | undefined = state.cvData;
        let templateId: string | undefined = state.templateId;

        // If ID is provided, load from backend
        if (id) {
          console.log('[CanvasCVEditorPage] Loading CV from backend:', id);
          try {
            const response = await apiClient.get(`/cv/${id}`);
            if (response.success && response.data) {
              cvData = response.data.cvData;
              if (response.data.templateId) {
                templateId = response.data.templateId;
              }
            } else {
              toast.error('CV not found');
              navigate('/dashboard');
              return;
            }
          } catch (error) {
            console.error('[CanvasCVEditorPage] Error loading CV:', error);
            toast.error('Failed to load CV');
            navigate('/dashboard');
            return;
          }
        }

        // Fallback to default if no CV data
        if (!cvData) {
          cvData = cvDataService.getDefaultCVData();
        }

        // Fallback to first template if no template ID
        if (!templateId) {
          templateId = templatePresets[0]?.id;
        }

        // Validate template exists
        if (templateId && !getTemplatePreset(templateId)) {
          console.warn('[CanvasCVEditorPage] Invalid template ID, using default:', templateId);
          templateId = templatePresets[0]?.id;
        }

        setInitialCVData(cvData);
        setInitialTemplateId(templateId);
        setIsLoading(false);

        console.log('[CanvasCVEditorPage] Initialized with:', {
          cvData,
          templateId,
          hasId: !!id,
        });
      } catch (error) {
        console.error('[CanvasCVEditorPage] Error loading CV:', error);
        toast.error('Failed to load CV');
        navigate('/dashboard');
      }
    };

    loadCVData();
  }, [id, state, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CV editor...</p>
        </div>
      </div>
    );
  }

  if (!initialCVData || !initialTemplateId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to initialize CV editor</p>
        </div>
      </div>
    );
  }

  return (
    <CVCanvasProvider
      initialCVData={initialCVData}
      initialTemplateId={initialTemplateId}
    >
      <div className="canvas-cv-editor-page">
        <CanvasCVEditorContent />
      </div>
    </CVCanvasProvider>
  );
};

export default CanvasCVEditorPage;
