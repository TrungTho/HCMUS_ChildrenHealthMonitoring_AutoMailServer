const cron = require("node-cron");
const globalFunction = require("../utils/util-function");

let task;

module.exports = scheduleTask = {
  autoMailState: true,

  //some things this server will work by it owns
  startAutoMailing: async function () {
    task = cron.schedule(
      "0 6 * * *", //6:00 am
      () => {
        globalFunction.sendNotificationMail();
      },
      { scheduled: true, timezone: "Asia/Bangkok" }
    );
  },

  scheduleResetTaskArray: async function () {
    cron.schedule(
      "1 0 * * *", //00:01 am
      () => {
        this.resetArrayTask();
      },
      { scheduled: true, timezone: "Asia/Bangkok" }
    );
  },

  //-----------------------------------------
  stopAutoMailing: async function () {
    task.stop();
  },

  //work with array task & custom notification
  arrayTask: [], //{eventId: ,task: }

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

  resetArrayTask: async function () {
    for (task of this.arrayTask) {
      task.task.stop();
      task.task.destroy();
    }

    //set array task to empty
    this.arrayTask = [];
  },
};
