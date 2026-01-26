const statusCodes = require("../constants/status-codes");
const APIResponse = require("../helpers/api-response-format");

class CVController {
  static service = require("../service/cv");
  async generateCV(req, res) {
    try {
      const cvData = await CVController.service.handleGenerateCV(req.body);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
      return res.status(statusCodes.SUCCESS).send(cvData);
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .json(new APIResponse(err.statusCode, false, err.message));
    }
  }
}

module.exports = new CVController();
