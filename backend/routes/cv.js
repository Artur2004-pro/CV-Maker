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

/**
 * @swagger
 * /api/cv/save:
 *   post:
 *     summary: Save or update a CV
 *     tags: [CV Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: CV ID for update (optional for new CV)
 *               cvData:
 *                 type: object
 *                 description: CV data structure
 *               templateId:
 *                 type: string
 *                 description: Template ID
 *               name:
 *                 type: string
 *                 description: CV name
 *     responses:
 *       200:
 *         description: CV saved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/save", authenticate, cvController.saveCV);

/**
 * @swagger
 * /api/cv/{id}:
 *   get:
 *     summary: Get CV by ID
 *     tags: [CV Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV retrieved successfully
 *       404:
 *         description: CV not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticate, cvController.getCV);

/**
 * @swagger
 * /api/cv:
 *   get:
 *     summary: Get all CVs for the current user
 *     tags: [CV Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CVs retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, cvController.getUserCVs);

/**
 * @swagger
 * /api/cv/{id}:
 *   delete:
 *     summary: Delete CV by ID
 *     tags: [CV Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV deleted successfully
 *       404:
 *         description: CV not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authenticate, cvController.deleteCV);

module.exports = router;
