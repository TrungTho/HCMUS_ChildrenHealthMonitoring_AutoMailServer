const scheduleTaskMdw = require("../../middlewares/schedule-task.mdw");
const globalFunction = require("../../utils/util-function");

module.exports = mailController = {
  manualSendMail: async function (req, res) {
    try {
      const numberOfSentEmail = await globalFunction.sendNotificationMail();
      console.log(numberOfSentEmail);
      return res.send({ success: true, numberOfSentEmail });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  startAutoSendMail: async function (req, res) {
    try {
      scheduleTaskMdw.startAutoMailing();
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  stopAutoSendMail: async function (req, res) {
    try {
      scheduleTaskMdw.stopAutoMailing();
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },
};
