import React from 'react';
import ProfessionalDashboard from '../../components/dashboard/ProfessionalDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ProButton } from '../../components/ui/ProButton';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in-up">
          <h2 className="text-3xl font-semibold text-text-primary mb-3 tracking-tight">Authentication Required</h2>
          <p className="text-text-secondary mb-8 text-base">Please log in to access the dashboard.</p>
          <ProButton
            onClick={() => navigate('/login')}
            variant="primary"
            size="lg"
          >
            Go to Login
          </ProButton>
        </div>
      </div>
    );
  }

  return <ProfessionalDashboard />;
};

export default DashboardPage;
