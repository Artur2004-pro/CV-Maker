import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CanvasProvider } from '../../contexts/CanvasContext';
import CanvasEditor from '../../components/canvas/CanvasEditor';
import { useAuth } from '../../hooks/useAuth';
import { cvDataService } from '../../services/cvDataService';
import { templatePresets } from '../../data/template-presets';
import type { CVData } from '../../types/api';

interface EditorLocationState {
  cvData?: CVData;
  templateId?: string;
}

const CanvasCVEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const state = (location.state || {}) as EditorLocationState;

  const initialCVData: CVData =
    state.cvData || cvDataService.getDefaultCVData();

  const initialTemplateId: string =
    state.templateId || templatePresets[0]?.id;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <CanvasProvider>
      <div className="canvas-cv-editor-page">
        <CanvasEditor />
      </div>
    </CanvasProvider>
  );
};

export default CanvasCVEditorPage;
