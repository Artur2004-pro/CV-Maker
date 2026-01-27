const generatePDF = require("../helpers/pdf-generator");
const CVModel = require("../models/cv");

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

  /**
   * Save or update CV
   */
  async handleSaveCV(userId, payload) {
    const { id, cvData, templateId, name } = payload;

    if (!cvData || !templateId) {
      const err = new Error("CV data and template ID are required");
      err.statusCode = 400;
      throw err;
    }

    // Validate CV data structure
    if (!cvData.personalInfo) {
      const err = new Error("Personal information is required");
      err.statusCode = 400;
      throw err;
    }

    const cvPayload = {
      userId,
      templateId,
      cvData,
      name: name || "My CV",
      updatedAt: new Date(),
    };

    let cv;
    if (id) {
      // Update existing CV
      cv = await CVModel.findOneAndUpdate(
        { _id: id, userId },
        cvPayload,
        { new: true, runValidators: true }
      );

      if (!cv) {
        const err = new Error("CV not found or access denied");
        err.statusCode = 404;
        throw err;
      }
    } else {
      // Create new CV
      cv = new CVModel(cvPayload);
      await cv.save();
    }

    return {
      id: cv._id.toString(),
      cvData: cv.cvData,
      templateId: cv.templateId,
      name: cv.name,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    };
  }

  /**
   * Get CV by ID
   */
  async handleGetCV(userId, cvId) {
    const cv = await CVModel.findOne({ _id: cvId, userId });

    if (!cv) {
      const err = new Error("CV not found or access denied");
      err.statusCode = 404;
      throw err;
    }

    return {
      id: cv._id.toString(),
      cvData: cv.cvData,
      templateId: cv.templateId,
      name: cv.name,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    };
  }

  /**
   * Get all CVs for a user
   */
  async handleGetUserCVs(userId) {
    const cvs = await CVModel.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id templateId name createdAt updatedAt");

    return cvs.map((cv) => ({
      id: cv._id.toString(),
      templateId: cv.templateId,
      name: cv.name,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }));
  }

  /**
   * Delete CV
   */
  async handleDeleteCV(userId, cvId) {
    const cv = await CVModel.findOneAndDelete({ _id: cvId, userId });

    if (!cv) {
      const err = new Error("CV not found or access denied");
      err.statusCode = 404;
      throw err;
    }

    return { success: true };
  }
}

module.exports = new CVService();
