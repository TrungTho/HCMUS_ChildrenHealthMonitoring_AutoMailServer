const express = require("express");
const mailController = require("./mail.controller");
const router = express.Router();

// router.get("/", mailController.testFullText);

router.post("/manual-send-mail", mailController.manualSendMail);

router.post("/stop-auto-send-mail", mailController.stopAutoSendMail);
router.post("/start-auto-send-mail", mailController.startAutoSendMail);

module.exports = router;
