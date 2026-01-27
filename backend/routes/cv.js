const router = require("express").Router();
const cvController = require("../controller/cv");

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
router.post("/generate", cvController.generateCV);

module.exports = router;
