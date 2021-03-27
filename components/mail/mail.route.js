const express = require("express");
const mailController = require("./mail.controller");
const router = express.Router();

// router.get("/", mailController.testFullText);

router.post("/manual-send-mail", mailController.manualSendMail);

// router.get("/schedule-task", testController.scheduleSendThing);

module.exports = router;
