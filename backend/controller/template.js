class TemplateController {
  static service = require("../service/template");
  async getTemplates(req, res) {
    try {
      const templates = await TemplateController.service.handleGetTemplates(
        req.body,
      );
      return res.status(200).json({ payload: templates, success: true });
    } catch (err) {
      return res
        .status(err.statusCode)
        .send({ message: err.message, success: false });
    }
  }
}

module.exports = new TemplateController();
