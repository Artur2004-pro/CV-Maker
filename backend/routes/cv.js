const router = require("express").Router();
const cvController = require("../controller/cv");

router.post("/generate", cvController.generateCV);

module.exports = router;
