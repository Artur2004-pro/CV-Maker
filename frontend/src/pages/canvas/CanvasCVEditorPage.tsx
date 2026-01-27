import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CanvasProvider } from '../../contexts/CanvasContext';
import CanvasEditor from '../../components/canvas/CanvasEditor';
import { useAuth } from '../../hooks/useAuth';

const CanvasCVEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
