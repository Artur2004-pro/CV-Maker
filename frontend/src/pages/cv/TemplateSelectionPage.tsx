import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProCard } from '../../components/ui/ProCard';
import { ProButton } from '../../components/ui/ProButton';
import { templatePresets } from '../../data/template-presets';
import type { CVData } from '../../types/api';

interface LocationState {
  cvData?: CVData;
}

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const handleSelectTemplate = (templateId: string) => {
    navigate('/editor', {
      state: {
        cvData: state.cvData,
        templateId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Choose a Template</h1>
            <p className="text-gray-600 mt-1">
              Pick a layout for your CV. You can customize all content and layout in the editor.
            </p>
          </div>
          <ProButton
            variant="outline"
            onClick={() =>
              navigate('/editor', {
                state: { cvData: state.cvData },
              })
            }
          >
            Skip for now
          </ProButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatePresets.map((preset) => (
            <ProCard
              key={preset.id}
              variant="elevated"
              className="overflow-hidden border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                {/* Placeholder thumbnail area; real thumbnails can be wired later */}
                <span className="text-gray-400 text-sm">Template Preview</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900">{preset.name}</h2>
                <p className="text-sm text-gray-600 mt-1 flex-1">{preset.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {preset.category}
                  </span>
                  {preset.isPremium && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <ProButton
                    fullWidth
                    size="sm"
                    onClick={() => handleSelectTemplate(preset.id)}
                  >
                    Use this template
                  </ProButton>
                </div>
              </div>
            </ProCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;

