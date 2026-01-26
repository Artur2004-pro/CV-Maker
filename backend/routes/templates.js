const router = require("express").Router();
const TemplateValidator = require("../validator/template");
const templateController = require("../controller/template");

router.get(
  "/",
  TemplateValidator.validateGetTemplates,
  templateController.getTemplates,
);

module.exports = router;
