const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CV Maker API',
      version: '1.0.0',
      description: 'A comprehensive API for creating and managing professional CVs with templates',
      contact: {
        name: 'API Support',
        email: 'support@cvmaker.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.cvmaker.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authentication token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'password123'
            }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'confirmPassword'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (min 6 characters)',
              example: 'password123'
            },
            confirmPassword: {
              type: 'string',
              format: 'password',
              description: 'Password confirmation',
              example: 'password123'
            }
          }
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['email', 'code'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            code: {
              type: 'string',
              description: '6-digit verification code',
              example: '123456'
            }
          }
        },
        ResendVerificationRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            }
          }
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'code', 'newPassword'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            code: {
              type: 'string',
              description: '6-digit password reset code',
              example: '123456'
            },
            newPassword: {
              type: 'string',
              format: 'password',
              description: 'New password',
              example: 'newpassword123'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'First name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '+1234567890'
            },
            location: {
              type: 'string',
              description: 'Location',
              example: 'New York, NY'
            },
            summary: {
              type: 'string',
              description: 'Professional summary',
              example: 'Experienced software developer with 5+ years of experience'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of skills',
              example: ['JavaScript', 'React', 'Node.js']
            },
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'English'
                  },
                  level: {
                    type: 'string',
                    example: 'Fluent'
                  }
                }
              },
              description: 'List of languages'
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  company: {
                    type: 'string',
                    example: 'Tech Company'
                  },
                  position: {
                    type: 'string',
                    example: 'Senior Developer'
                  },
                  startDate: {
                    type: 'string',
                    example: '2020-01'
                  },
                  endDate: {
                    type: 'string',
                    example: '2023-12'
                  },
                  description: {
                    type: 'string',
                    example: 'Led development of key features'
                  }
                }
              },
              description: 'Work experience'
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  school: {
                    type: 'string',
                    example: 'University of Technology'
                  },
                  degree: {
                    type: 'string',
                    example: 'Bachelor of Science in Computer Science'
                  },
                  startDate: {
                    type: 'string',
                    example: '2016-09'
                  },
                  endDate: {
                    type: 'string',
                    example: '2020-06'
                  }
                }
              },
              description: 'Education background'
            }
          }
        },
        CVGenerateRequest: {
          type: 'object',
          required: ['data', 'template'],
          properties: {
            data: {
              $ref: '#/components/schemas/UserProfile'
            },
            template: {
              type: 'string',
              enum: ['modern', 'corporate'],
              description: 'Template type',
              example: 'modern'
            }
          }
        },
        APIResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 200
            },
            success: {
              type: 'boolean',
              description: 'Request success status',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Operation successful'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400
            },
            success: {
              type: 'boolean',
              description: 'Request success status',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Bad request'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controller/*.js', './models/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
