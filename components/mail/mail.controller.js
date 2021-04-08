const scheduleTaskMdw = require("../../middlewares/schedule-task.mdw");
const globalFunction = require("../../utils/util-function");
const cron = require("node-cron");

module.exports = mailController = {
  manualSendMail: async function (req, res) {
    try {
      const numberOfSentEmail = await globalFunction.sendNotificationMail();
      console.log(numberOfSentEmail);
      return res.send({ success: true, numberOfSentEmail });
    } catch (error) {
      console.log(error);
      return res.status(406).send({ success: false, error });
    }
  },

  startAutoSendMail: async function (req, res) {
    try {
      scheduleTaskMdw.startAutoMailing();
      scheduleTaskMdw.autoMailState = true;
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  stopAutoSendMail: async function (req, res) {
    try {
      scheduleTaskMdw.stopAutoMailing();
      scheduleTaskMdw.autoMailState = false;
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  getAutoMailState: async function (req, res) {
    try {
      return res.send({ success: true, state: scheduleTaskMdw.autoMailState });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  sendCustomMail: async function (req, res) {
    try {
      console.log("---------------begin---------------");
      //get configs
      const timeString = req.body.timeString;
      const contents = req.body.contents;
      cron.schedule(
        timeString,
        () => {
          // globalFunction.sendMail();
          console.log(contents);
        },
        { scheduled: true, timezone: "Asia/Bangkok" }
      );
      return res.send({ success: true });
    } catch (error) {
      console.log("err:", error);
      return res.status(406).send({ success: false, error });
    }
  },
};
