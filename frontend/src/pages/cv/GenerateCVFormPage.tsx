import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProCard } from '../../components/ui/ProCard';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { apiClient } from '../../services/apiClient';
import type { CVData, Experience, Education, Skill, ApiResponse } from '../../types/api';
import toast from 'react-hot-toast';

interface ExperienceForm extends Omit<Experience, 'id'> {
  id?: string;
}

interface EducationForm extends Omit<Education, 'id'> {
  id?: string;
}

interface SkillForm extends Omit<Skill, 'id'> {
  id?: string;
}

const GenerateCVFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  });

  const [experience, setExperience] = useState<ExperienceForm[]>([]);
  const [education, setEducation] = useState<EducationForm[]>([]);
  const [skills, setSkills] = useState<SkillForm[]>([]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExperience = () => {
    setExperience(prev => [
      ...prev,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ]);
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceForm, value: any) => {
    setExperience(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddEducation = () => {
    setEducation(prev => [
      ...prev,
      {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
      },
    ]);
  };

  const handleEducationChange = (index: number, field: keyof EducationForm, value: any) => {
    setEducation(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddSkill = () => {
    setSkills(prev => [
      ...prev,
      {
        name: '',
        level: 'Intermediate',
      },
    ]);
  };

  const handleSkillChange = (index: number, field: keyof SkillForm, value: any) => {
    setSkills(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        personalInfo,
        summary: personalInfo.summary,
        experience,
        education,
        skills,
      };

      const response: ApiResponse<CVData> = await apiClient.post('/cv/generate-data', payload);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate CV data');
      }

      toast.success('CV data generated. Choose a template next.');
      navigate('/cv/templates', { state: { cvData: response.data } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate CV');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate CV</h1>
        <p className="text-gray-600 mb-6">
          Fill out the key details below. We will normalize this into a structured CV that you can edit visually.
        </p>

        <ProCard variant="elevated" className="p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProInput
                  label="First Name"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handlePersonalChange}
                  placeholder="John"
                  required
                />
                <ProInput
                  label="Last Name"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handlePersonalChange}
                  placeholder="Doe"
                  required
                />
                <ProInput
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalChange}
                  placeholder="john.doe@example.com"
                  required
                />
                <ProInput
                  label="Phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
                <ProInput
                  label="Location"
                  name="location"
                  value={personalInfo.location}
                  onChange={handlePersonalChange}
                  placeholder="City, Country"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                  name="summary"
                  value={personalInfo.summary}
                  onChange={handlePersonalChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe your background, strengths, and what you're looking for."
                />
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                <ProButton type="button" variant="outline" size="sm" onClick={handleAddExperience}>
                  Add Experience
                </ProButton>
              </div>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <ProCard key={index} variant="subtle" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProInput
                        label="Company"
                        value={exp.company}
                        onChange={e => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                      <ProInput
                        label="Position"
                        value={exp.position}
                        onChange={e => handleExperienceChange(index, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                      <ProInput
                        label="Start Date"
                        value={exp.startDate}
                        onChange={e => handleExperienceChange(index, 'startDate', e.target.value)}
                        placeholder="Jan 2020"
                      />
                      <ProInput
                        label="End Date"
                        value={exp.endDate}
                        onChange={e => handleExperienceChange(index, 'endDate', e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={exp.current}
                          onChange={e => handleExperienceChange(index, 'current', e.target.checked)}
                        />
                        <span className="ml-2">I currently work here</span>
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={e => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Summarize your responsibilities and achievements."
                      />
                    </div>
                  </ProCard>
                ))}
                {experience.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add at least one role to showcase your professional experience.
                  </p>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                <ProButton type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                  Add Education
                </ProButton>
              </div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <ProCard key={index} variant="subtle" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProInput
                        label="School"
                        value={edu.school}
                        onChange={e => handleEducationChange(index, 'school', e.target.value)}
                        placeholder="University name"
                      />
                      <ProInput
                        label="Degree"
                        value={edu.degree}
                        onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="BSc, MSc, etc."
                      />
                      <ProInput
                        label="Field of Study"
                        value={edu.field}
                        onChange={e => handleEducationChange(index, 'field', e.target.value)}
                        placeholder="Computer Science"
                      />
                      <ProInput
                        label="Start Date"
                        value={edu.startDate}
                        onChange={e => handleEducationChange(index, 'startDate', e.target.value)}
                        placeholder="2018"
                      />
                      <ProInput
                        label="End Date"
                        value={edu.endDate}
                        onChange={e => handleEducationChange(index, 'endDate', e.target.value)}
                        placeholder="2022"
                      />
                      <ProInput
                        label="GPA (optional)"
                        value={edu.gpa || ''}
                        onChange={e => handleEducationChange(index, 'gpa', e.target.value)}
                        placeholder="3.8 / 4.0"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={edu.current}
                          onChange={e => handleEducationChange(index, 'current', e.target.checked)}
                        />
                        <span className="ml-2">I am currently studying here</span>
                      </label>
                    </div>
                  </ProCard>
                ))}
                {education.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add your most relevant degrees or certifications to strengthen your profile.
                  </p>
                )}
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                <ProButton type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                  Add Skill
                </ProButton>
              </div>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProInput
                      label="Skill"
                      value={skill.name}
                      onChange={e => handleSkillChange(index, 'name', e.target.value)}
                      placeholder="JavaScript, React, etc."
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={skill.level}
                        onChange={e =>
                          handleSkillChange(index, 'level', e.target.value as SkillForm['level'])
                        }
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-sm text-gray-500">
                    List key skills you want highlighted on your CV.
                  </p>
                )}
              </div>
            </section>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <ProButton type="submit" loading={isSubmitting}>
                Continue to Templates
              </ProButton>
            </div>
          </form>
        </ProCard>
      </div>
    </div>
  );
};

export default GenerateCVFormPage;

