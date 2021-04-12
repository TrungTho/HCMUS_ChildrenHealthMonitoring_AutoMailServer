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

  //work with array task & custom notification
  arrayTask: [],

  stopTaskInArray: async function (index) {
    if (index > -1 && index < this.arrayTask.length) {
      this.arrayTask[index].task.stop();
      console.log(this.arrayTask);
    }
  },

  destroyTaskInArray: async function (index) {
    if (index > -1 && index < this.arrayTask.length) {
      this.arrayTask[index].task.destroy();
      console.log(this.arrayTask);
    }
  },
};
