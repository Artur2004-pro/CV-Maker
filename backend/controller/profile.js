const statusCodes = require("../constants/status-codes");
const APIResponse = require("../helpers/api-response-format");
const User = require("../models/user");

class ProfileController {
  static service = require("../service/profile");

  async getProfile(req, res) {
    try {
      const profile = await ProfileController.service.getProfile(req.user.id);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(statusCodes.SUCCESS, true, "Profile retrieved successfully", profile),
        );
    } catch (err) {
      return res
        .status(err.statusCode)
        .json(new APIResponse(err.statusCode, false, err.message));
    }
  }

  async updateProfile(req, res) {
    try {
      const updatedProfile = await ProfileController.service.updateProfile(req.user.id, req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(statusCodes.SUCCESS, true, "Profile updated successfully", updatedProfile),
        );
    } catch (err) {
      return res
        .status(err.statusCode)
        .json(new APIResponse(err.statusCode, false, err.message));
    }
  }

  async deleteProfile(req, res) {
    try {
      await ProfileController.service.deleteProfile(req.user.id);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(statusCodes.SUCCESS, true, "Profile deleted successfully", null),
        );
    } catch (err) {
      return res
        .status(err.statusCode)
        .json(new APIResponse(err.statusCode, false, err.message));
    }
  }
}

module.exports = new ProfileController();
