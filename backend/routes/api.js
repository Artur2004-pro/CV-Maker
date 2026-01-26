const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/templates", require("./templates"));
router.use("/cv", require("./cv"));

module.exports = router;
