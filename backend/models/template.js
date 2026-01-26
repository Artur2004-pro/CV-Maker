const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    previewImageUrl: {
      type: String,
      required: true,
    },
    templateFileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Template", TemplateSchema);