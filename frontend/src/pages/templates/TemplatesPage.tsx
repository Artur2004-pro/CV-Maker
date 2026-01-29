import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Lock, Check, Plus, Sparkles } from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProCard } from '../../components/ui/ProCard';
import { ProInput } from '../../components/ui/ProInput';
import { apiClient } from '../../services/apiClient';
import type { Template } from '../../types/api';
import toast from 'react-hot-toast';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'modern', label: 'Modern' },
    { id: 'classic', label: 'Classic' },
    { id: 'creative', label: 'Creative' },
    { id: 'professional', label: 'Professional' },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Template[]>('/templates');
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      navigate(`/editor?template=${selectedTemplate}`);
    } else {
      toast.error('Please select a template first');
    }
  };

  const handleCreateTemplate = () => {
    navigate('/template-creator');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ProButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </ProButton>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Choose a Template</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <ProButton
                onClick={handleCreateTemplate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Template
              </ProButton>
              {selectedTemplate && (
                <ProButton onClick={handleUseTemplate}>
                  Use This Template
                </ProButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <ProInput
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <ProButton
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </ProButton>
              ))}
            </div>
          </div>
        </div>

        {/* Create Template Card */}
        <div className="mb-8">
          <ProCard 
            className="p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50"
            onClick={handleCreateTemplate}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Own Template</h3>
              <p className="text-gray-600 mb-4">
                Design a professional CV template from scratch with our advanced canvas editor
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Canvas Editor
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  Drag & Drop
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  Professional Tools
                </span>
              </div>
            </div>
          </ProCard>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <ProCard
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-indigo-500 shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="relative">
                    {/* Template Thumbnail */}
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback placeholder if image fails to load
                          e.currentTarget.src = `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(template.name)}`;
                        }}
                      />
                    </div>

                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </div>
                    )}

                    {/* Selected Badge */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 left-2 bg-indigo-500 text-white p-2 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {/* Template Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                        {template.isPremium && (
                          <span className="text-xs text-yellow-600 font-semibold">Premium</span>
                        )}
                      </div>
                    </div>
                  </div>
                </ProCard>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <ProButton onClick={handleCreateTemplate}>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your Own Template
            </ProButton>
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplatesPage;
