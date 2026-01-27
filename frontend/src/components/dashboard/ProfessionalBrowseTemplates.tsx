import React, { useState, useEffect } from 'react';
import { ProfessionalIcons } from '../ui/IconSystem';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { ProInput } from '../ui/ProInput';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  preview: string;
  isPremium: boolean;
  isNew: boolean;
  isPopular: boolean;
  downloads: number;
  rating: number;
  tags: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  category: string;
  sortBy: string;
  search: string;
  price: string;
}

export const ProfessionalBrowseTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    sortBy: 'popular',
    search: '',
    price: 'all'
  });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Templates', icon: ProfessionalIcons.GridIcon },
    { id: 'professional', name: 'Professional', icon: ProfessionalIcons.BriefcaseIcon },
    { id: 'creative', name: 'Creative', icon: ProfessionalIcons.SparkleIcon },
    { id: 'technical', name: 'Technical', icon: ProfessionalIcons.CpuIcon },
    { id: 'academic', name: 'Academic', icon: ProfessionalIcons.BookIcon },
    { id: 'executive', name: 'Executive', icon: ProfessionalIcons.CrownIcon }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: ProfessionalIcons.TrendingUpIcon },
    { id: 'newest', name: 'Newest First', icon: ProfessionalIcons.ClockIcon },
    { id: 'rating', name: 'Highest Rated', icon: ProfessionalIcons.StarIcon },
    { id: 'downloads', name: 'Most Downloaded', icon: ProfessionalIcons.DownloadIcon }
  ];

  const priceOptions = [
    { id: 'all', name: 'All Templates' },
    { id: 'free', name: 'Free Only' },
    { id: 'premium', name: 'Premium Only' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, filters]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTemplates: Template[] = [
        {
          id: '1',
          name: 'Modern Professional',
          description: 'Clean and modern design perfect for corporate roles',
          category: 'professional',
          thumbnail: '/templates/modern-professional-thumb.jpg',
          preview: '/templates/modern-professional-preview.jpg',
          isPremium: false,
          isNew: true,
          isPopular: true,
          downloads: 1250,
          rating: 4.8,
          tags: ['professional', 'corporate', 'clean', 'modern'],
          features: ['ATS-friendly', 'One-page', 'Photo placeholder', 'Cover letter'],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: '2',
          name: 'Executive Elite',
          description: 'Premium template for senior executives and C-level positions',
          category: 'executive',
          thumbnail: '/templates/executive-elite-thumb.jpg',
          preview: '/templates/executive-elite-preview.jpg',
          isPremium: true,
          isNew: false,
          isPopular: true,
          downloads: 890,
          rating: 4.9,
          tags: ['executive', 'senior', 'premium', 'luxury'],
          features: ['Two-page', 'Photo placeholder', 'Cover letter', 'References'],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18'
        },
        {
          id: '3',
          name: 'Creative Designer',
          description: 'Eye-catching template for creative professionals',
          category: 'creative',
          thumbnail: '/templates/creative-designer-thumb.jpg',
          preview: '/templates/creative-designer-preview.jpg',
          isPremium: true,
          isNew: true,
          isPopular: false,
          downloads: 650,
          rating: 4.7,
          tags: ['creative', 'designer', 'portfolio', 'modern'],
          features: ['Portfolio layout', 'Color scheme', 'Custom fonts', 'Social links'],
          createdAt: '2024-01-12',
          updatedAt: '2024-01-22'
        },
        {
          id: '4',
          name: 'Technical Developer',
          description: 'Optimized for software engineers and technical roles',
          category: 'technical',
          thumbnail: '/templates/technical-developer-thumb.jpg',
          preview: '/templates/technical-developer-preview.jpg',
          isPremium: false,
          isNew: false,
          isPopular: true,
          downloads: 2100,
          rating: 4.6,
          tags: ['technical', 'developer', 'engineer', 'programming'],
          features: ['Skills section', 'Projects', 'GitHub', 'Technical skills'],
          createdAt: '2024-01-08',
          updatedAt: '2024-01-16'
        },
        {
          id: '5',
          name: 'Academic Scholar',
          description: 'Perfect for academic and research positions',
          category: 'academic',
          thumbnail: '/templates/academic-scholar-thumb.jpg',
          preview: '/templates/academic-scholar-preview.jpg',
          isPremium: false,
          isNew: false,
          isPopular: false,
          downloads: 450,
          rating: 4.5,
          tags: ['academic', 'research', 'scholar', 'education'],
          features: ['Publications', 'Research', 'Education', 'References'],
          createdAt: '2024-01-05',
          updatedAt: '2024-01-14'
        },
        {
          id: '6',
          name: 'Minimal Clean',
          description: 'Simple and clean design for any profession',
          category: 'professional',
          thumbnail: '/templates/minimal-clean-thumb.jpg',
          preview: '/templates/minimal-clean-preview.jpg',
          isPremium: false,
          isNew: false,
          isPopular: false,
          downloads: 1800,
          rating: 4.4,
          tags: ['minimal', 'clean', 'simple', 'versatile'],
          features: ['One-page', 'Clean layout', 'Professional', 'ATS-friendly'],
          createdAt: '2024-01-03',
          updatedAt: '2024-01-12'
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filter by price
    if (filters.price === 'free') {
      filtered = filtered.filter(t => !t.isPremium);
    } else if (filters.price === 'premium') {
      filtered = filtered.filter(t => t.isPremium);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
    }

    setFilteredTemplates(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      if (selectedTemplate.isPremium) {
        toast.success('Premium template selected! Redirecting to payment...');
        // TODO: Redirect to payment flow
      } else {
        toast.success('Template selected! Redirecting to editor...');
        // TODO: Redirect to editor with template
        setTimeout(() => {
          // navigate('/editor', { state: { templateId: selectedTemplate.id } });
        }, 1500);
      }
    }
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  const getTemplateIcon = (template: Template) => {
    if (template.isPremium) {
      return <ProfessionalIcons.GemIcon size="sm" />;
    }
    if (template.isNew) {
      return <ProfessionalIcons.SparkleIcon size="sm" />;
    }
    if (template.isPopular) {
      return <ProfessionalIcons.StarIcon size="sm" />;
    }
    return null;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ProfessionalIcons.StarIcon
        key={i}
        size="sm"
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ProfessionalIcons.LoadingIcon size="3xl" />
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.TemplatesIcon size="md" color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse Templates</h1>
                <p className="text-sm text-gray-600">Choose from our professional CV templates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ProButton
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                <ProfessionalIcons.FilterIcon size="sm" />
                <span className="ml-2">Filters</span>
              </ProButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <ProCard variant="elevated" className="p-6 mb-8 border-0 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <ProInput
                placeholder="Search templates..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<ProfessionalIcons.SearchIcon size="sm" />}
                variant="default"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <select
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priceOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ProCard>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <ProCard
              key={template.id}
              variant="elevated"
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Template Header */}
              <div className="relative">
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                  <ProfessionalIcons.FileTextIcon size="xl" className="text-gray-400" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  {getTemplateIcon(template)}
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full">
                      PRO
                    </span>
                  )}
                  {template.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(template.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ProfessionalIcons.HeartIcon
                    size="sm"
                    className={favorites.includes(template.id) ? 'text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              {/* Template Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(template.rating)}
                      <span className="ml-1">{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ProfessionalIcons.DownloadIcon size="sm" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ProCard>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <ProCard variant="elevated" className="p-12 text-center border-0 shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ProfessionalIcons.SearchIcon size="lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <ProButton
              variant="outline"
              onClick={() => setFilters({ category: 'all', sortBy: 'popular', search: '', price: 'all' })}
            >
              Clear Filters
            </ProButton>
          </ProCard>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ProfessionalIcons.CloseIcon size="md" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Preview Content */}
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6">
                <ProfessionalIcons.FileTextIcon size="2xl" className="text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedTemplate.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedTemplate.rating)}
                      <span className="text-sm text-gray-600">{selectedTemplate.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedTemplate.downloads} downloads
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {selectedTemplate.isPremium && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
                        Premium
                      </span>
                    )}
                    <ProButton
                      onClick={handleUseTemplate}
                      variant={selectedTemplate.isPremium ? 'gradient' : 'primary'}
                      className="shadow-lg hover:shadow-xl"
                    >
                      <ProfessionalIcons.EditIcon size="sm" />
                      <span className="ml-2">
                        {selectedTemplate.isPremium ? 'Upgrade & Use' : 'Use Template'}
                      </span>
                    </ProButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalBrowseTemplates;
