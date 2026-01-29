const User = require("../models/user");
const Errors = require("../errors/");

class ProfileService {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password -verificationCode -verificationCodeExpiry -passwordResetCode -passwordResetCodeExpiry');
      
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }

      // Return profile data or empty profile structure
      return user.profile || {
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        location: '',
        summary: '',
        skills: [],
        languages: [],
        experience: [],
        education: []
      };
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }

      // Validate profile data
      if (!profileData || typeof profileData !== 'object') {
        throw new Errors.BadRequestException("Invalid profile data");
      }

      // Update profile
      user.profile = {
        ...user.profile,
        ...profileData,
        email: user.email // Keep email from user record, not from profile data
      };

      await user.save();

      return user.profile;
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }

  async deleteProfile(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }

      // Clear profile data
      user.profile = {
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        location: '',
        summary: '',
        skills: [],
        languages: [],
        experience: [],
        education: []
      };

      await user.save();
      return true;
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
}

module.exports = new ProfileService();
