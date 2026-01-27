class ProfileValidator {
  static validateGetProfile(req, res, next) {
    next();
  }

  static validateUpdateProfile(req, res, next) {
    // Basic validation
    const { body } = req;
    const errors = [];

    if (body.firstName && typeof body.firstName !== 'string') {
      errors.push('First name must be a string');
    }
    if (body.lastName && typeof body.lastName !== 'string') {
      errors.push('Last name must be a string');
    }
    if (body.phone && typeof body.phone !== 'string') {
      errors.push('Phone must be a string');
    }
    if (body.location && typeof body.location !== 'string') {
      errors.push('Location must be a string');
    }
    if (body.summary && typeof body.summary !== 'string') {
      errors.push('Summary must be a string');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  }
}

module.exports = ProfileValidator;
