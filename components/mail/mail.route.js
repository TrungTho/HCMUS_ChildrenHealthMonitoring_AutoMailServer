const express = require("express");
const mailController = require("./mail.controller");
const router = express.Router();

// router.get("/", mailController.testFullText);

router.post("/manual-send-mail", mailController.manualSendMail);
router.post("/stop-auto-send-mail", mailController.stopAutoSendMail);
router.post("/start-auto-send-mail", mailController.startAutoSendMail);
router.post("/get-state", mailController.getAutoMailState);
router.get("/get-state", mailController.getAutoMailState);

// router.post("/send-custom-mail", mailController.sendCustomMail);
router.post("/new-custom-task", mailController.pushNewTaskToArray);
router.post("/stop-custom-task", mailController.stopTaskInArray);
router.post("/update-custom-task", mailController.updateTaskInArray);
router.post("/destroy-custom-task", mailController.destroyTaskInArray);
router.post("/get-task-array", mailController.getArrayTask);
router.post("/reset-task-array", mailController.resetArrayTask);

module.exports = router;
