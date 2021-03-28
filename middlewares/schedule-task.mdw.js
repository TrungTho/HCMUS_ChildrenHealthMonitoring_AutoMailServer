const cron = require("node-cron");
const globalFunction = require("../utils/util-function");

let task;

module.exports = scheduleTask = {
  autoMailState: true,
  startAutoMailing: async function () {
    task = cron.schedule(
      "0 6 * * *",
      () => {
        globalFunction.sendNotificationMail();
      },
      { scheduled: true, timezone: "Asia/Bangkok" }
    );
  },

  stopAutoMailing: async function () {
    task.stop();
  },
};
