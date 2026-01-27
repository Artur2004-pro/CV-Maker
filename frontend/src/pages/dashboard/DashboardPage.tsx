import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Download, Layout, Settings, LogOut } from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user, logout, displayName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const quickActions = [
    {
      title: 'Create New CV',
      description: 'Start from scratch with a professional template',
      icon: <Plus className="w-6 h-6" />,
      action: () => navigate('/editor'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      title: 'Upload Existing CV',
      description: 'Import your current resume and enhance it',
      icon: <FileText className="w-6 h-6" />,
      action: () => navigate('/upload'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Browse Templates',
      description: 'Explore our collection of professional templates',
      icon: <Layout className="w-6 h-6" />,
      action: () => navigate('/templates'),
      color: 'bg-pink-500 hover:bg-pink-600',
    },
  ];

  const recentCVs = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      lastModified: '2 days ago',
      template: 'Modern Professional',
    },
    {
      id: '2',
      title: 'Product Manager CV',
      lastModified: '1 week ago',
      template: 'Creative Designer',
    },
    {
      id: '3',
      title: 'Marketing Resume',
      lastModified: '2 weeks ago',
      template: 'Classic Executive',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">CV Maker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{displayName}</span>
              </div>
              <ProButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4" />
              </ProButton>
              <ProButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}!
          </h2>
          <p className="text-gray-600">
            Create professional resumes that stand out and land your dream job
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <ProCard
                key={index}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={action.action}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  {action.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </ProCard>
            ))}
          </div>
        </div>

        {/* Recent CVs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent CVs</h3>
            <ProButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/editor')}
            >
              View All
            </ProButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCVs.map((cv) => (
              <ProCard key={cv.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cv.title}</h4>
                    <p className="text-sm text-gray-600">{cv.template}</p>
                  </div>
                  <div className="flex space-x-2">
                    <ProButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/editor/${cv.id}`)}
                    >
                      <FileText className="w-4 h-4" />
                    </ProButton>
                    <ProButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Download logic */}}
                    >
                      <Download className="w-4 h-4" />
                    </ProButton>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Last modified: {cv.lastModified}</p>
              </ProCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
