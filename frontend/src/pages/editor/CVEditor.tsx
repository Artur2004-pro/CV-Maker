import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Eye, Plus, Trash2 } from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import type { CVData, PersonalInfo, Experience, Education, Skill } from '../../types/api';
import toast from 'react-hot-toast';

export const CVEditor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: '',
      website: '',
      linkedin: '',
      github: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
  });

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const deleteExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    };
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const deleteEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
    };
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const deleteSkill = (id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save logic here - API call to save CV data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('CV saved successfully!');
    } catch (error) {
      toast.error('Failed to save CV');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      // PDF generation logic here
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ProButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </ProButton>
              <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <ProButton
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </ProButton>
              <ProButton
                loading={isSaving}
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </ProButton>
              <ProButton
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </ProButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <ProCard className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </ProCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isPreview ? (
              <ProCard className="p-8">
                <div className="bg-white p-8 shadow-lg">
                  {/* CV Preview */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                    </h2>
                    <p className="text-gray-600">{cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}</p>
                  </div>
                  
                  {cvData.personalInfo.summary && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                      <p className="text-gray-700">{cvData.personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {cvData.experience.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {cvData.education.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                          <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                          <p className="text-gray-600">{edu.school} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {cvData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill) => (
                          <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            {skill.name} ({skill.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ProCard>
            ) : (
              <div className="space-y-6">
                {activeSection === 'personal' && (
                  <ProCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProInput
                        label="First Name"
                        value={cvData.personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                      <ProInput
                        label="Last Name"
                        value={cvData.personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                      <ProInput
                        label="Email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                      />
                      <ProInput
                        label="Phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                      <ProInput
                        label="Location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        placeholder="City, Country"
                      />
                      <ProInput
                        label="Website"
                        value={cvData.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                      <ProInput
                        label="LinkedIn"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        placeholder="LinkedIn profile URL"
                      />
                      <ProInput
                        label="GitHub"
                        value={cvData.personalInfo.github}
                        onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        placeholder="GitHub profile URL"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={4}
                        value={cvData.personalInfo.summary}
                        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                        placeholder="Write a brief summary about yourself..."
                      />
                    </div>
                  </ProCard>
                )}

                {activeSection === 'experience' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      <ProButton onClick={addExperience}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProInput
                              label="Position"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Job title"
                            />
                            <ProInput
                              label="Company"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company name"
                            />
                            <ProInput
                              label="Start Date"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              placeholder="MM/YYYY"
                            />
                            <ProInput
                              label="End Date"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="MM/YYYY or leave blank if current"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              Currently working here
                            </label>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                            />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <ProButton
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExperience(exp.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </ProButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}

                {activeSection === 'education' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                      <ProButton onClick={addEducation}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProInput
                              label="School"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                              placeholder="University/College name"
                            />
                            <ProInput
                              label="Degree"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="e.g., Bachelor's, Master's"
                            />
                            <ProInput
                              label="Field of Study"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              placeholder="e.g., Computer Science"
                            />
                            <ProInput
                              label="GPA (optional)"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="e.g., 3.8"
                            />
                            <ProInput
                              label="Start Date"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              placeholder="MM/YYYY"
                            />
                            <ProInput
                              label="End Date"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              placeholder="MM/YYYY or leave blank if current"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={edu.current}
                                onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              Currently studying here
                            </label>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <ProButton
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEducation(edu.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </ProButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}

                {activeSection === 'skills' && (
                  <ProCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <ProButton onClick={addSkill}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </ProButton>
                    </div>
                    <div className="space-y-4">
                      {cvData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-4">
                          <ProInput
                            label="Skill Name"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="e.g., JavaScript, Project Management"
                            className="flex-1"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <ProButton
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSkill(skill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </ProButton>
                        </div>
                      ))}
                    </div>
                  </ProCard>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEditor;
