const globalFunction = require("../../utils/util-function");

module.exports = testController = {
  manualSendMail: async function (req, res) {
    try {
      const numberOfSentEmail = globalFunction.sendNotificationMail();
      res.send({ success: true, numberOfSentEmail });
    } catch (error) {
      res.status(406).send({ success: false, error });
    }
  },
};
