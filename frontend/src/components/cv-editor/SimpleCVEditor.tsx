import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { ProInput } from '../ui/ProInput';
import { pdfGenerator } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
}

export const SimpleCVEditor: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadCVData();
  }, []);

  const loadCVData = () => {
    try {
      const savedData = localStorage.getItem('cv_data');
      if (savedData) {
        setCvData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load CV data:', error);
    }
  };

  const saveCVData = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('cv_data', JSON.stringify(cvData));
      toast.success('CV saved successfully!');
    } catch (error) {
      toast.error('Failed to save CV');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await pdfGenerator.generatePDF(cvData);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const deleteExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const deleteEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate' as const,
      category: ''
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const deleteSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    };
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const deleteProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <Settings className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Edit2 className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <Plus className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Settings className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">CV Editor</h1>
            <div className="flex items-center space-x-3">
              <ProButton
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="border-gray-300 text-gray-700 hover:border-gray-400"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </ProButton>
              <ProButton
                loading={isSaving}
                onClick={saveCVData}
                variant="secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </ProButton>
              <ProButton
                loading={isGeneratingPDF}
                onClick={generatePDF}
                variant="primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProCard variant="elevated" className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <ProButton
                    key={section.id}
                    variant={activeSection === section.id ? 'primary' : 'ghost'}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full justify-start ${
                      activeSection === section.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </ProButton>
                ))}
              </nav>
            </ProCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'personal' && (
              <ProCard variant="elevated" className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProInput
                    label="Full Name"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                  <ProInput
                    label="Email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                  <ProInput
                    label="Phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  <ProInput
                    label="Location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                  <ProInput
                    label="Website"
                    value={cvData.personalInfo.website || ''}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://johndoe.com"
                  />
                  <ProInput
                    label="LinkedIn"
                    value={cvData.personalInfo.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="A brief summary of your professional background and goals..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300"
                  />
                </div>
              </ProCard>
            )}

            {activeSection === 'experience' && (
              <ProCard variant="elevated" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                  <ProButton onClick={addExperience} variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </ProButton>
                </div>
                <div className="space-y-6">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Experience {cvData.experience.indexOf(exp) + 1}</h3>
                        <ProButton
                          variant="ghost"
                          onClick={() => deleteExperience(exp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ProButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProInput
                          label="Job Title"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          placeholder="Software Engineer"
                        />
                        <ProInput
                          label="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Tech Company"
                        />
                        <ProInput
                          label="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="San Francisco, CA"
                        />
                        <ProInput
                          label="Start Date"
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                        <ProInput
                          label="End Date"
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                            Currently working here
                          </label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                  {cvData.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No experience added yet. Click "Add Experience" to get started.</p>
                    </div>
                  )}
                </div>
              </ProCard>
            )}

            {activeSection === 'education' && (
              <ProCard variant="elevated" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                  <ProButton onClick={addEducation} variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </ProButton>
                </div>
                <div className="space-y-6">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Education {cvData.education.indexOf(edu) + 1}</h3>
                        <ProButton
                          variant="ghost"
                          onClick={() => deleteEducation(edu.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ProButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProInput
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                        />
                        <ProInput
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="University Name"
                        />
                        <ProInput
                          label="Location"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                        <ProInput
                          label="GPA (Optional)"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.8"
                        />
                        <ProInput
                          label="Start Date"
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                        <ProInput
                          label="End Date"
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          disabled={edu.current}
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`edu-current-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`edu-current-${edu.id}`} className="text-sm text-gray-700">
                            Currently studying
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cvData.education.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No education added yet. Click "Add Education" to get started.</p>
                    </div>
                  )}
                </div>
              </ProCard>
            )}

            {activeSection === 'skills' && (
              <ProCard variant="elevated" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                  <ProButton onClick={addSkill} variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </ProButton>
                </div>
                <div className="space-y-4">
                  {cvData.skills.map((skill) => (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <ProInput
                            label="Skill Name"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="JavaScript"
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <select
                              value={skill.level}
                              onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          <ProInput
                            label="Category"
                            value={skill.category}
                            onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                            placeholder="Programming"
                          />
                        </div>
                        <ProButton
                          variant="ghost"
                          onClick={() => deleteSkill(skill.id)}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ProButton>
                      </div>
                    </div>
                  ))}
                  {cvData.skills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No skills added yet. Click "Add Skill" to get started.</p>
                    </div>
                  )}
                </div>
              </ProCard>
            )}

            {activeSection === 'projects' && (
              <ProCard variant="elevated" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                  <ProButton onClick={addProject} variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </ProButton>
                </div>
                <div className="space-y-6">
                  {cvData.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Project {cvData.projects.indexOf(project) + 1}</h3>
                        <ProButton
                          variant="ghost"
                          onClick={() => deleteProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ProButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProInput
                          label="Project Name"
                          value={project.name}
                          onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                          placeholder="My Awesome Project"
                        />
                        <ProInput
                          label="Technologies"
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                          placeholder="React, Node.js, MongoDB"
                        />
                        <ProInput
                          label="Project URL"
                          value={project.url || ''}
                          onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                          placeholder="https://myproject.com"
                        />
                        <ProInput
                          label="GitHub URL"
                          value={project.github || ''}
                          onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="Describe your project and what you accomplished..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                  {cvData.projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No projects added yet. Click "Add Project" to get started.</p>
                    </div>
                  )}
                </div>
              </ProCard>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-4">
              <ProCard variant="elevated" className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">CV Preview</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                  {/* CV Preview Content */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
                    <div className="text-gray-600 space-y-1">
                      <p>{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
                      <p>{cvData.personalInfo.location}</p>
                      {(cvData.personalInfo.website || cvData.personalInfo.linkedin) && (
                        <p>
                          {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
                          {cvData.personalInfo.website && cvData.personalInfo.linkedin && <span> • </span>}
                          {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  {cvData.personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                      <p className="text-gray-700">{cvData.personalInfo.summary}</p>
                    </div>
                  )}

                  {cvData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                              <p className="text-gray-700">{exp.company} • {exp.location}</p>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-gray-700">{edu.institution} • {edu.location}</p>
                              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {cvData.skills.map((skill) => (
                          <div key={skill.id} className="text-gray-700">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-gray-500 text-sm"> ({skill.level})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvData.projects.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Projects</h2>
                      {cvData.projects.map((project) => (
                        <div key={project.id} className="mb-4">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-1">
                            Technologies: {project.technologies.join(', ')}
                          </p>
                          {project.description && (
                            <p className="text-gray-700">{project.description}</p>
                          )}
                          {(project.url || project.github) && (
                            <p className="text-gray-600 text-sm mt-1">
                              {project.url && <span><a href={project.url} className="text-blue-600 hover:underline">Live Demo</a></span>}
                              {project.url && project.github && <span> • </span>}
                              {project.github && <span><a href={project.github} className="text-blue-600 hover:underline">GitHub</a></span>}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ProCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCVEditor;
