import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleCVEditor from '../../components/cv-editor/SimpleCVEditor';
import { useAuth } from '../../hooks/useAuth';

export const CVEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the CV editor.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <SimpleCVEditor />;
};

export default CVEditorPage;
