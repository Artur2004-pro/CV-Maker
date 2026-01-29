import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Eye, Download, Heart, Clock, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { ProInput } from '../ui/ProInput';
import type { Template } from '../../types/api';
import toast from 'react-hot-toast';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  isFavorite: boolean;
  onToggleFavorite: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onSelect, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Zap className="w-4 h-4" />;
      case 'classic': return <Briefcase className="w-4 h-4" />;
      case 'creative': return <Star className="w-4 h-4" />;
      case 'professional': return <GraduationCap className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'modern': return 'from-blue-500 to-purple-500';
      case 'classic': return 'from-gray-600 to-gray-800';
      case 'creative': return 'from-pink-500 to-orange-500';
      case 'professional': return 'from-indigo-500 to-blue-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform ${
        isHovered ? 'scale-105 -translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(template)}
    >
      <ProCard variant="glass" className="overflow-hidden h-full">
        {/* Template Preview */}
        <div className="relative h-48 bg-gradient-to-br from-white/10 to-white/5 rounded-t-lg overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(template.category)} opacity-20`} />
          
          {/* Template Thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-40 bg-white/90 rounded shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">{getCategoryIcon(template.category)}</div>
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  {template.category}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Badge */}
          {template.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              PRO
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template.id);
            }}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300">
              <div className="flex space-x-2">
                <ProButton
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </ProButton>
                <ProButton
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Template downloaded!');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Use
                </ProButton>
              </div>
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2">{template.name}</h3>
          <p className="text-white/70 text-sm mb-3 line-clamp-2">{template.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(template.category)} text-white`}>
                {getCategoryIcon(template.category)}
                <span>{template.category}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">4.8</span>
            </div>
          </div>
        </div>
      </ProCard>
    </div>
  );
};

export const BrowseTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Mock templates data
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Modern Professional',
      description: 'Clean and modern design perfect for tech professionals and creative roles',
      thumbnail: '',
      category: 'modern',
      isPremium: false
    },
    {
      id: '2',
      name: 'Classic Executive',
      description: 'Traditional design suitable for senior management and corporate positions',
      thumbnail: '',
      category: 'classic',
      isPremium: false
    },
    {
      id: '3',
      name: 'Creative Designer',
      description: 'Eye-catching template for designers, artists, and creative professionals',
      thumbnail: '',
      category: 'creative',
      isPremium: true
    },
    {
      id: '4',
      name: 'Minimal Clean',
      description: 'Simple yet elegant design that focuses on content clarity',
      thumbnail: '',
      category: 'modern',
      isPremium: false
    },
    {
      id: '5',
      name: 'Academic Scholar',
      description: 'Professional template designed for academic and research positions',
      thumbnail: '',
      category: 'professional',
      isPremium: true
    },
    {
      id: '6',
      name: 'Business Leader',
      description: 'Executive template designed for leadership and management roles',
      thumbnail: '',
      category: 'professional',
      isPremium: false
    }
  ];

  useEffect(() => {
    // Simulate loading templates
    setTimeout(() => {
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedCategory, templates]);

  const handleSelectTemplate = (template: Template) => {
    if (template.isPremium) {
      toast.success('Opening premium template preview...');
    } else {
      toast.success(`Selected ${template.name} template`);
    }
  };

  const handleToggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(templateId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const categories = [
    { value: 'all', label: 'All Templates', icon: <Filter className="w-4 h-4" /> },
    { value: 'modern', label: 'Modern', icon: <Zap className="w-4 h-4" /> },
    { value: 'classic', label: 'Classic', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'creative', label: 'Creative', icon: <Star className="w-4 h-4" /> },
    { value: 'professional', label: 'Professional', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <ProCard variant="glass" className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </ProCard>
    );
  }

  return (
    <ProCard variant="glass" className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Browse Templates</h2>
        <p className="text-white/80">
          Choose from our collection of professional CV templates designed for every career path.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <ProInput
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            variant="glass"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <ProButton
              key={category.value}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={`transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-white/30 text-white border-white/50'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              {category.icon}
              <span className="ml-2">{category.label}</span>
            </ProButton>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              isFavorite={favorites.has(template.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-white/60 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
          <ProButton
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            variant="outline"
            className="border-white/30 text-white/80 hover:text-white"
          >
            Clear Filters
          </ProButton>
        </div>
      )}

      {/* Load More */}
      {filteredTemplates.length > 0 && filteredTemplates.length >= 6 && (
        <div className="mt-8 text-center">
          <ProButton
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Load More Templates
          </ProButton>
        </div>
      )}
    </ProCard>
  );
};

export default BrowseTemplates;
