const Error = require("../errors/");
const Template = require("../models/template");

class TemplateService {
  async handleGetTemplates() {
    try {
      const templates = await Template.find({});
      return templates;
    } catch (err) {
      throw Error.handleServiceError(err);
    }
  }
}

module.exports = new TemplateService();
