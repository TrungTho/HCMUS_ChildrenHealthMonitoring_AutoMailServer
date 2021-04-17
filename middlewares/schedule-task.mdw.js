const cron = require("node-cron");
const diaryVaccineModel = require("../models/diary-vaccine.model");
const diaryModel = require("../models/diary.model");
const userModel = require("../models/user.model");
const globalFunction = require("../utils/util-function");

let task;

module.exports = scheduleTask = {
  autoMailState: true,

  //some things this server will work by it owns
  //at 06:00 everyday, server will send default mail for user depends on data in db
  startAutoMailing: async function () {
    task = cron.schedule(
      "0 6 * * *", //6:00 am
      () => {
        globalFunction.sendNotificationMail();
      },
      { scheduled: true, timezone: "Asia/Bangkok" }
    );
  },

  //at 00:01 everyday, server will get data in db and build array-
  //task of reminderes in new day to schedule custom notification
  scheduleResetTaskArray: async function () {
    cron.schedule(
      "1 0 * * *", //00:01 am
      () => {
        //reset array task of yesterday's reminders
        this.resetArrayTask();

        //build new task of today's reminders
        this.queryNewTaskInDb();
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
    } else {
      console.log("out of array");
    }
  },

  destroyTaskInArray: async function (index) {
    if (index > -1 && index < this.arrayTask.length) {
      this.arrayTask[index].task.stop();
      this.arrayTask[index].task.destroy();
      console.log(this.arrayTask);
    } else {
      console.log("out of array");
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

  queryNewTaskInDb: async function () {
    try {
      //get all remider need to be reminded in db
      const reminders = await diaryVaccineModel.getAllReminderInDay();

      // console.log("hehehe", reminders);
      //add reminder => array task => schedule noti
      for (reminder of reminders) {
        let remindTime = reminder.remindDate;

        let timeString = `${new Date(remindTime).getSeconds()} ${new Date(
          remindTime
        ).getMinutes()} ${new Date(remindTime).getHours()} * * *`;

        console.log("timestring", timeString);

        let diaryInfor = await diaryModel.getSingle(reminder.id_diary);
        let userInfor = await userModel.getSingle(diaryInfor.id_user);

        console.log(diaryInfor);
        console.log(userInfor);

        let contents = {
          clientFullname: userInfor.fullname,
          clientEmail: userInfor.email,
          diaryName: diaryInfor.fullname,
          emailContents:
            "<p><strong>" +
            1 +
            ". Vaccine " +
            reminder.vaccineName +
            "</strong>" +
            " (Ngừa các bệnh: " +
            reminder.vaccine +
            ") </p>",
        };

        //push new task to array task
        this.arrayTask.push({
          eventId: reminder.id, //id of event for finding & modifying after
          task: cron.schedule(
            timeString,
            () => {
              //log for debuging
              console.log(contents);

              //call fucntion to send mail
              globalFunction.sendMail(
                contents.clientFullname,
                contents.clientEmail,
                contents.diaryName,
                contents.emailContents
              );
            },
            { scheduled: true, timezone: "Asia/Bangkok" }
          ),
        });
      }
    } catch (error) {
      console.log("err", error);
    }
  },
};
