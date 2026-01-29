import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalIcons } from '../../components/ui/IconSystem';
import { ProButton } from '../../components/ui/ProButton';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';

const CanvasTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: ProfessionalIcons.EditIcon,
      title: 'Interactive Canvas',
      description: 'Drag and drop elements to create your perfect CV layout'
    },
    {
      icon: ProfessionalIcons.GridIcon,
      title: 'Professional Templates',
      description: 'Choose from modern, professional CV templates'
    },
    {
      icon: ProfessionalIcons.SaveIcon,
      title: 'Auto-Save',
      description: 'Your work is automatically saved as you build'
    },
    {
      icon: ProfessionalIcons.DownloadIcon,
      title: 'Export Options',
      description: 'Download your CV in multiple formats (PDF, DOCX, etc.)'
    },
    {
      icon: ProfessionalIcons.EyeIcon,
      title: 'Live Preview',
      description: 'See exactly how your CV will look in real-time'
    },
    {
      icon: ProfessionalIcons.SparkleIcon,
      title: 'Smart Suggestions',
      description: 'AI-powered suggestions to improve your CV content'
    }
  ];

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech roles',
      icon: ProfessionalIcons.FileTextIcon,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'executive',
      name: 'Executive Elite',
      description: 'Sophisticated design for senior professionals',
      icon: ProfessionalIcons.AwardIcon,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Bold and artistic design for creative professionals',
      icon: ProfessionalIcons.StarIcon,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple and elegant design for any industry',
      icon: ProfessionalIcons.CircleIcon,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const handleStartBuilding = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/editor');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/editor?template=${templateId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <ProfessionalIcons.EditIcon size="2xl" color="white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Canvas CV Builder
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning, professional CVs with our interactive canvas editor. 
              Drag, drop, and design your perfect resume in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProButton
                variant="gradient"
                size="xl"
                onClick={handleStartBuilding}
                className="px-8 py-4 text-lg"
              >
                <ProfessionalIcons.AddIcon size="lg" className="mr-2" />
                Start Building Your CV
              </ProButton>
              
              <ProButton
                variant="outline"
                size="xl"
                onClick={() => navigate('/templates')}
                className="px-8 py-4 text-lg"
              >
                <ProfessionalIcons.TemplatesIcon size="lg" className="mr-2" />
                Browse Templates
              </ProButton>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Canvas Builder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional features that make CV creation effortless and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ProCard key={index} variant="elevated" className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size="lg" color="white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </ProCard>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Template
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with a professional template or create from scratch
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <ProCard
                key={template.id}
                variant="elevated"
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className={`w-full h-32 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <template.icon size="2xl" color="white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {template.description}
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm group-hover:text-blue-700">
                  Use this template →
                </div>
              </ProCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <ProButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/templates')}
              className="px-6 py-3"
            >
              <ProfessionalIcons.TemplatesIcon size="md" className="mr-2" />
              View All Templates
            </ProButton>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Professional CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have created stunning CVs with our canvas builder
          </p>
          <ProButton
            variant="white"
            size="xl"
            onClick={handleStartBuilding}
            className="px-8 py-4 text-lg"
          >
            <ProfessionalIcons.EditIcon size="lg" className="mr-2" />
            Start Building Now
          </ProButton>
        </div>
      </div>
    </div>
  );
};

export default CanvasTemplatePage;
