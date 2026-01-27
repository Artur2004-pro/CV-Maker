const router = require("express").Router();
const TemplateValidator = require("../validator/template");
const templateController = require("../controller/template");

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all available CV templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Template ID
 *                             example: modern
 *                           name:
 *                             type: string
 *                             description: Template name
 *                             example: Modern Template
 *                           description:
 *                             type: string
 *                             description: Template description
 *                             example: A clean and modern CV template
 *                           thumbnail:
 *                             type: string
 *                             description: Template thumbnail URL
 *                             example: /templates/modern-thumb.png
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  TemplateValidator.validateGetTemplates,
  templateController.getTemplates,
);

module.exports = router;
