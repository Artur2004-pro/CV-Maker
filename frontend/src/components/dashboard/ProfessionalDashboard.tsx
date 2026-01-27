import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProfessionalIcons } from '../ui/IconSystem';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import ProfessionalUploadCV from './ProfessionalUploadCV';
import ProfessionalBrowseTemplates from './ProfessionalBrowseTemplates';
import ProfessionalAnalytics from './ProfessionalAnalytics';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalCVs: number;
  recentCVs: number;
  templatesUsed: number;
  completionRate: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  link: string;
  badge?: string;
}

interface RecentCV {
  id: string;
  name: string;
  lastModified: string;
  status: 'draft' | 'completed' | 'published';
  template: string;
  completion: number;
}

export const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'templates' | 'analytics'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalCVs: 0,
    recentCVs: 0,
    templatesUsed: 0,
    completionRate: 0,
  });
  const [recentCVs, setRecentCVs] = useState<RecentCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const quickActions: QuickAction[] = [
    {
      id: 'create-cv',
      title: 'Canvas Builder',
      description: 'Interactive canvas CV builder with drag & drop',
      icon: ProfessionalIcons.EditIcon,
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
      link: '/canvas',
      badge: 'New'
    },
    {
      id: 'create-cv-simple',
      title: 'Create New CV',
      description: 'Start building your professional CV',
      icon: ProfessionalIcons.AddIcon,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      link: '/editor'
    },
    {
      id: 'upload-cv',
      title: 'Upload Existing CV',
      description: 'Import your current CV and enhance it',
      icon: ProfessionalIcons.UploadIcon,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      link: '/dashboard/upload'
    },
    {
      id: 'browse-templates',
      title: 'Browse Templates',
      description: 'Choose from professional templates',
      icon: ProfessionalIcons.TemplatesIcon,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      link: '/templates'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Track your CV performance',
      icon: ProfessionalIcons.ChartIcon,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      link: '/analytics'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ProfessionalIcons.HomeIcon },
    { id: 'upload', label: 'Upload CV', icon: ProfessionalIcons.UploadIcon },
    { id: 'templates', label: 'Templates', icon: ProfessionalIcons.TemplatesIcon },
    { id: 'analytics', label: 'Analytics', icon: ProfessionalIcons.ChartIcon }
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalCVs: 12,
        recentCVs: 3,
        templatesUsed: 8,
        completionRate: 85
      });

      setRecentCVs([
        {
          id: '1',
          name: 'Software Engineer CV',
          lastModified: '2 hours ago',
          status: 'completed',
          template: 'Modern Professional',
          completion: 100
        },
        {
          id: '2',
          name: 'Product Manager Resume',
          lastModified: '1 day ago',
          status: 'draft',
          template: 'Executive',
          completion: 75
        },
        {
          id: '3',
          name: 'Data Scientist CV',
          lastModified: '3 days ago',
          status: 'published',
          template: 'Technical',
          completion: 100
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'published':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <ProfessionalIcons.SuccessIcon size="sm" />;
      case 'draft':
        return <ProfessionalIcons.EditIcon size="sm" />;
      case 'published':
        return <ProfessionalIcons.ShareIcon size="sm" />;
      default:
        return <ProfessionalIcons.InfoIcon size="sm" />;
    }
  };

  const renderOverviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <ProfessionalIcons.LoadingIcon size="3xl" />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Primary CV Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create your next CV</h2>
            <p className="text-sm text-gray-600 mt-1">
              Start from an AI-assisted flow or design from scratch on the canvas editor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ProButton
              variant="primary"
              className="flex items-center justify-center px-4 py-2"
              onClick={() => navigate('/cv/generate')}
            >
              <ProfessionalIcons.SparkleIcon size="sm" className="mr-2" />
              Generate CV
            </ProButton>
            <ProButton
              variant="outline"
              className="flex items-center justify-center px-4 py-2"
              onClick={() => navigate('/editor')}
            >
              <ProfessionalIcons.EditIcon size="sm" className="mr-2" />
              Create CV from Scratch
            </ProButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total CVs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCVs}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ProfessionalIcons.TrendingUpIcon size="sm" />
                  <span className="ml-1">+2 this week</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.FileTextIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recentCVs}</p>
                <p className="text-sm text-blue-600 mt-2">Last 7 days</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.ActivityIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates Used</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.templatesUsed}</p>
                <p className="text-sm text-purple-600 mt-2">+1 new</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.TemplatesIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
                <p className="text-sm text-orange-600 mt-2">Great progress!</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.AwardIcon size="lg" />
              </div>
            </div>
          </ProCard>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.id} to={action.link}>
                <ProCard variant="elevated" className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon size="lg" color="white" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </ProCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent CVs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent CVs</h3>
            <ProButton 
              variant="outline" 
              className="border-gray-300 text-gray-700"
              onClick={() => navigate('/editor')}
            >
              View All
              <ProfessionalIcons.ArrowRightIcon size="sm" className="ml-2" />
            </ProButton>
          </div>
          
          <ProCard variant="elevated" className="border-0 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">CV Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Template</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Modified</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Completion</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCVs.map((cv) => (
                    <tr key={cv.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ProfessionalIcons.FileTextIcon size="sm" />
                          </div>
                          <span className="font-medium text-gray-900">{cv.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{cv.template}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{cv.lastModified}</td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cv.status)}`}>
                          {getStatusIcon(cv.status)}
                          <span className="ml-1">{cv.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                              style={{ width: `${cv.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{cv.completion}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            onClick={() => navigate(`/editor/${cv.id}`)}
                            title="Edit CV"
                          >
                            <ProfessionalIcons.EditIcon size="sm" />
                          </button>
                          <button 
                            className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                            onClick={() => navigate(`/editor/${cv.id}`)}
                            title="View CV"
                          >
                            <ProfessionalIcons.ViewIcon size="sm" />
                          </button>
                          <button 
                            className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                            onClick={() => {
                              // Simulate download
                              toast.success(`Downloading ${cv.name}...`);
                            }}
                            title="Download CV"
                          >
                            <ProfessionalIcons.DownloadIcon size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProCard>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <ProfessionalIcons.HomeIcon size="md" color="white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ProfessionalIcons.BellIcon size="md" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Professional Plan</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <ProButton
                variant="ghost"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <ProfessionalIcons.LogoutIcon size="sm" />
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size="sm" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverviewContent()}
        {activeTab === 'upload' && <ProfessionalUploadCV />}
        {activeTab === 'templates' && <ProfessionalBrowseTemplates />}
        {activeTab === 'analytics' && <ProfessionalAnalytics />}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
