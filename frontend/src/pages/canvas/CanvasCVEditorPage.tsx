import React, { useEffect, useState, useRef } from 'react';
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
  const initialTemplateIdRef = useRef<string | null>(null);
  const applyTemplateRef = useRef(applyTemplate);
  const cvDataRef = useRef(cvData);

  // Обновляем refs при изменении значений
  useEffect(() => {
    applyTemplateRef.current = applyTemplate;
  }, [applyTemplate]);

  useEffect(() => {
    cvDataRef.current = cvData;
  }, [cvData]);

  useEffect(() => {
    // Применяем шаблон при монтировании, изменении templateId или cvData
    if (templateId && cvData) {
      // Проверяем, нужно ли применить шаблон (новый templateId или новый cvData)
      const templateChanged = templateId !== initialTemplateIdRef.current;
      const cvDataChanged = JSON.stringify(cvDataRef.current) !== JSON.stringify(cvData);
      
      if (templateChanged || cvDataChanged) {
        const template = getTemplatePreset(templateId);
        if (template) {
          console.log('[CanvasCVEditorPage] Applying template:', {
            templateId,
            reason: templateChanged ? 'templateId changed' : 'cvData changed',
            cvDataPresent: !!cvData
          });
          // Используем refs для получения актуальных значений без добавления в зависимости
          applyTemplateRef.current(template, cvDataRef.current);
          initialTemplateIdRef.current = templateId;
        } else {
          console.warn('[CanvasCVEditorPage] Template not found:', templateId);
          toast.error(`Template "${templateId}" not found. Using default template.`);
        }
      }
    }
  }, [templateId, cvData]); // Добавлен cvData в зависимости для re-apply при изменении

  return <CanvasEditor />;
};

const CanvasCVEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Получаем state из location напрямую (для PDF import)
  const state = (location.state as EditorLocationState) || {};

  // Debug: Log location state on mount and changes
  useEffect(() => {
    console.log('[CanvasCVEditorPage] Location state changed:', {
      pathname: location.pathname,
      state: location.state,
      hasCvData: !!(location.state as EditorLocationState)?.cvData,
      hasTemplateId: !!(location.state as EditorLocationState)?.templateId,
      fullState: location.state
    });
  }, [location]);

  const [initialCVData, setInitialCVData] = useState<CVData | undefined>(undefined);
  const [initialTemplateId, setInitialTemplateId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const dataLoadedRef = useRef<string | undefined | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load CV data if ID is provided or if cvData is in location state
  useEffect(() => {
    // Не загружаем данные, если пользователь не аутентифицирован
    if (!isAuthenticated) {
      return;
    }

    // Если есть cvData в location state, загружаем его (PDF import case)
    const hasLocationCVData = state.cvData && !id;
    
    // Предотвращаем повторную загрузку данных для того же id
    // Но разрешаем загрузку, если есть новый cvData в location state
    const locationStateKey = state.cvData ? JSON.stringify(state.cvData).substring(0, 50) : null;
    const lastLoadedKey = dataLoadedRef.current;
    
    if (lastLoadedKey === id && !hasLocationCVData && !locationStateKey) {
      return;
    }

    const loadCVData = async () => {
      try {
        let cvData: CVData | undefined = state.cvData;
        let templateId: string | undefined = state.templateId;
        
        // Try to load from sessionStorage if location state is missing
        if (!cvData && !id) {
          try {
            const pendingCvData = sessionStorage.getItem('pending_cv_data');
            if (pendingCvData) {
              cvData = JSON.parse(pendingCvData);
              sessionStorage.removeItem('pending_cv_data'); // Clean up after use
              console.log('[CanvasCVEditorPage] Loaded CV data from sessionStorage');
            }
          } catch (storageError) {
            console.warn('[CanvasCVEditorPage] Failed to load from sessionStorage:', storageError);
          }
        }
        
        console.log('[CanvasCVEditorPage] Loading CV data:', {
          hasLocationState: !!state.cvData,
          hasSessionStorage: !!sessionStorage.getItem('pending_cv_data'),
          hasId: !!id,
          cvData: cvData ? 'present' : 'missing',
          templateId,
          locationState: state,
          fullLocationState: location.state
        });
        
        // Log if cvData is from PDF import
        if (cvData && !id) {
          console.log('[CanvasCVEditorPage] PDF import detected - cvData:', {
            source: state.cvData ? 'location state' : 'sessionStorage',
            personalInfo: cvData.personalInfo,
            experienceCount: cvData.experience?.length || 0,
            educationCount: cvData.education?.length || 0,
            skillsCount: cvData.skills?.length || 0
          });
        }

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

        // Проверяем, что у нас есть валидный templateId
        if (!templateId) {
          console.error('[CanvasCVEditorPage] No template available');
          toast.error('No template available. Please create a template first.');
          navigate('/dashboard');
          return;
        }

        setInitialCVData(cvData);
        setInitialTemplateId(templateId);
        setIsLoading(false);
        // Сохраняем id или location state key для предотвращения повторной загрузки
        dataLoadedRef.current = id || locationStateKey || 'loaded';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, state.cvData, state.templateId]);

  if (!isAuthenticated) {
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
