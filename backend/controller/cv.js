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

  async generateCVData(req, res) {
    try {
      const cvData = await CVController.service.handleGenerateCVData(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "CV data generated successfully",
            cvData,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }

  async saveCV(req, res) {
    try {
      const userId = req.user.id;
      const result = await CVController.service.handleSaveCV(userId, req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "CV saved successfully",
            result,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }

  async getCV(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const result = await CVController.service.handleGetCV(userId, id);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "CV retrieved successfully",
            result,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.NOT_FOUND;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }

  async getUserCVs(req, res) {
    try {
      const userId = req.user.id;
      const result = await CVController.service.handleGetUserCVs(userId);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "CVs retrieved successfully",
            result,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }

  async deleteCV(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const result = await CVController.service.handleDeleteCV(userId, id);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "CV deleted successfully",
            result,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.NOT_FOUND;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
}

module.exports = new CVController();
