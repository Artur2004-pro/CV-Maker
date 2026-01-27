const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    cvData: {
      personalInfo: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        summary: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
      },
      experience: [
        {
          id: { type: String, required: true },
          company: { type: String, default: "" },
          position: { type: String, default: "" },
          startDate: { type: String, default: "" },
          endDate: { type: String, default: "" },
          current: { type: Boolean, default: false },
          description: { type: String, default: "" },
        },
      ],
      education: [
        {
          id: { type: String, required: true },
          school: { type: String, default: "" },
          degree: { type: String, default: "" },
          field: { type: String, default: "" },
          startDate: { type: String, default: "" },
          endDate: { type: String, default: "" },
          current: { type: Boolean, default: false },
          gpa: { type: String, default: "" },
        },
      ],
      skills: [
        {
          id: { type: String, required: true },
          name: { type: String, default: "" },
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
            default: "Intermediate",
          },
        },
      ],
      languages: [
        {
          id: { type: String, required: true },
          name: { type: String, default: "" },
          proficiency: {
            type: String,
            enum: ["Basic", "Conversational", "Fluent", "Native"],
            default: "Basic",
          },
        },
      ],
      certificates: [
        {
          id: { type: String, required: true },
          name: { type: String, default: "" },
          issuer: { type: String, default: "" },
          date: { type: String, default: "" },
          url: { type: String, default: "" },
        },
      ],
    },
    name: {
      type: String,
      default: "My CV",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
cvSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("CV", cvSchema);

