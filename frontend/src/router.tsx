import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CanvasCVEditorPage from './pages/canvas/CanvasCVEditorPage';
import CanvasTemplatePage from './pages/canvas/CanvasTemplatePage';
import TemplatesPage from './pages/templates/TemplatesPage';
import TemplateCreatorPage from './pages/template-creator/TemplateCreatorPage';
import ProfessionalAnalytics from './components/dashboard/ProfessionalAnalytics';
import GenerateCVFormPage from './pages/cv/GenerateCVFormPage';
import TemplateSelectionPage from './pages/cv/TemplateSelectionPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-accent border-t-transparent"></div>
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-accent border-t-transparent"></div>
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute>
            <ForgotPasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv/generate"
        element={
          <ProtectedRoute>
            <GenerateCVFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv/templates"
        element={
          <ProtectedRoute>
            <TemplateSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <CanvasCVEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <CanvasCVEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/template-creator"
        element={
          <ProtectedRoute>
            <TemplateCreatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <ProfessionalAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/canvas"
        element={
          <ProtectedRoute>
            <CanvasTemplatePage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
