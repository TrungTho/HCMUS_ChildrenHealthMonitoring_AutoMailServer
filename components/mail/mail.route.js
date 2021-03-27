const express = require("express");
const mailController = require("./mail.controller");
const router = express.Router();

router.get("/", mailController.testFullText);

router.get("/connection", mailController.logConnectionStats);

// router.get("/schedule-task", testController.scheduleSendThing);

module.exports = router;
