const cron = require("node-cron");
const globalFunction = require("../utils/util-function");

let task;

module.exports = scheduleTask = {
  arrayTask: [],

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

  stopTaskInArray: async function (index) {
    if (index > -1 && index < this.arrayTask.length) {
      this.arrayTask[index].stop();
    }
  },

  destroyTaskInArray: async function (index) {
    if (index > -1 && index < this.arrayTask.length) {
      this.arrayTask[index].destroy();
      console.log(this.arrayTask[index]);
    }
  },
};
