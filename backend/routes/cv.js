const router = require("express").Router();
const cvController = require("../controller/cv");
const { authenticate } = require("../middleware/auth");

/**
 * @swagger
 * /api/cv/generate:
 *   post:
 *     summary: Generate a CV PDF from user data and template
 *     tags: [CV Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVGenerateRequest'
 *     responses:
 *       200:
 *         description: CV generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/generate", authenticate, cvController.generateCV);

/**
 * @swagger
 * /api/cv/generate-data:
 *   post:
 *     summary: Normalize raw CV form input into structured CV data
 *     tags: [CV Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalInfo:
 *                 type: object
 *               summary:
 *                 type: string
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: CV data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/generate-data", authenticate, cvController.generateCVData);

module.exports = router;
