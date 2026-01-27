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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'published':
        return 'bg-accent-light text-accent border-accent/30';
      default:
        return 'bg-surface-hover text-text-secondary border-border';
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-2">
          <div>
            <h2 className="text-3xl font-semibold text-text-primary tracking-tight mb-2">Create your next CV</h2>
            <p className="text-base text-text-secondary">
              Start from an AI-assisted flow or design from scratch on the canvas editor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ProButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/cv/generate')}
            >
              <ProfessionalIcons.SparkleIcon size="sm" />
              Generate CV
            </ProButton>
            <ProButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/editor')}
            >
              <ProfessionalIcons.EditIcon size="sm" />
              Create CV from Scratch
            </ProButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ProCard variant="elevated" className="p-6 border-0 shadow-premium card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Total CVs</p>
                <p className="text-4xl font-semibold text-text-primary mb-2 tracking-tight">{stats.totalCVs}</p>
                <p className="text-sm text-green-600 flex items-center gap-1.5">
                  <ProfessionalIcons.TrendingUpIcon size="sm" />
                  <span>+2 this week</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                <ProfessionalIcons.FileTextIcon size="lg" className="text-accent" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-premium card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Recent Activity</p>
                <p className="text-4xl font-semibold text-text-primary mb-2 tracking-tight">{stats.recentCVs}</p>
                <p className="text-sm text-accent">Last 7 days</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.ActivityIcon size="lg" className="text-green-600" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-premium card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Templates Used</p>
                <p className="text-4xl font-semibold text-text-primary mb-2 tracking-tight">{stats.templatesUsed}</p>
                <p className="text-sm text-purple-600">+1 new</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.TemplatesIcon size="lg" className="text-purple-600" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-premium card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Completion Rate</p>
                <p className="text-4xl font-semibold text-text-primary mb-2 tracking-tight">{stats.completionRate}%</p>
                <p className="text-sm text-orange-600">Great progress!</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.AwardIcon size="lg" className="text-orange-600" />
              </div>
            </div>
          </ProCard>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-semibold text-text-primary mb-5 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((action) => (
              <Link key={action.id} to={action.link}>
                <ProCard variant="elevated" hover className="p-6 border-0 shadow-premium cursor-pointer group">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200`}>
                      <action.icon size="lg" color="white" />
                    </div>
                    {action.badge && (
                      <span className="px-2.5 py-1 bg-accent-light text-accent text-xs font-medium rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{action.description}</p>
                </ProCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent CVs */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-semibold text-text-primary tracking-tight">Recent CVs</h3>
            <ProButton 
              variant="outline" 
              size="md"
              onClick={() => navigate('/editor')}
            >
              View All
              <ProfessionalIcons.ArrowRightIcon size="sm" />
            </ProButton>
          </div>
          
          <ProCard variant="elevated" className="border-0 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-hover">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">CV Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Template</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Last Modified</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Completion</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentCVs.map((cv) => (
                    <tr key={cv.id} className="hover:bg-surface-hover transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-accent-light rounded-lg flex items-center justify-center">
                            <ProfessionalIcons.FileTextIcon size="sm" className="text-accent" />
                          </div>
                          <span className="font-medium text-text-primary">{cv.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary">{cv.template}</td>
                      <td className="py-4 px-6 text-sm text-text-secondary">{cv.lastModified}</td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cv.status)}`}>
                          {getStatusIcon(cv.status)}
                          <span className="capitalize">{cv.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px] bg-surface-hover rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-accent to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${cv.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-text-secondary font-medium min-w-[40px]">{cv.completion}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-text-tertiary hover:text-accent hover:bg-accent-light rounded-lg transition-all duration-150"
                            onClick={() => navigate(`/editor/${cv.id}`)}
                            title="Edit CV"
                          >
                            <ProfessionalIcons.EditIcon size="sm" />
                          </button>
                          <button 
                            className="p-2 text-text-tertiary hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-150"
                            onClick={() => navigate(`/editor/${cv.id}`)}
                            title="View CV"
                          >
                            <ProfessionalIcons.ViewIcon size="sm" />
                          </button>
                          <button 
                            className="p-2 text-text-tertiary hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-150"
                            onClick={() => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-surface/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-soft">
                  <ProfessionalIcons.HomeIcon size="md" color="white" />
                </div>
                <h1 className="text-xl font-semibold text-text-primary tracking-tight">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover">
                <ProfessionalIcons.BellIcon size="md" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-text-primary">{user?.email}</p>
                  <p className="text-xs text-text-tertiary">Professional Plan</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center shadow-soft ring-2 ring-white">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <ProButton
                variant="ghost"
                onClick={logout}
                className="text-text-secondary hover:text-red-600"
              >
                <ProfessionalIcons.LogoutIcon size="sm" />
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 transition-all duration-200 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-accent text-accent bg-accent-light/10'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <tab.icon size="sm" />
                <span className="font-medium text-sm">{tab.label}</span>
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
