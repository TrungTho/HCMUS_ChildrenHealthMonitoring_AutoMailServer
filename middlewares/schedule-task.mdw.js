const cron = require("node-cron");

let task;

module.exports = scheduleTask = {
  startAutoMailing: async function () {
    task = cron.schedule(
      "* * * * * *",
      () => {
        console.log("hehe");
      },
      { scheduled: true, timezone: "Asia/Bangkok" }
    );
  },

  stopAutoMailing: async function () {
    task.stop();
  },
};
