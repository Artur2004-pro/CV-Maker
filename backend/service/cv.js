const generatePDF = require("../helpers/pdf-generator");

class CVService {
  async handleGenerateCV(payload) {
    const { data, template } = payload;

    if (!data || !template) {
      const err = new Error("Invalid CV payload");
      err.statusCode = 400;
      throw err;
    }

    return generatePDF(data, template);
  }

  async handleGenerateCVData(payload) {
    const {
      personalInfo,
      summary,
      experience = [],
      education = [],
      skills = [],
    } = payload || {};

    if (!personalInfo) {
      const err = new Error("Personal information is required");
      err.statusCode = 400;
      throw err;
    }

    const normalized = {
      personalInfo: {
        firstName: personalInfo.firstName || "",
        lastName: personalInfo.lastName || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        summary: summary || personalInfo.summary || "",
        website: personalInfo.website || "",
        linkedin: personalInfo.linkedin || "",
        github: personalInfo.github || "",
      },
      experience: (experience || []).map((exp, index) => ({
        id: exp.id || String(index + 1),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: Boolean(exp.current),
        description: exp.description || "",
      })),
      education: (education || []).map((edu, index) => ({
        id: edu.id || String(index + 1),
        school: edu.school || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        current: Boolean(edu.current),
        gpa: edu.gpa || "",
      })),
      skills: (skills || []).map((skill, index) => ({
        id: skill.id || String(index + 1),
        name: skill.name || "",
        level: skill.level || "Intermediate",
      })),
      languages: [],
      certificates: [],
    };

    return normalized;
  }
}

module.exports = new CVService();
