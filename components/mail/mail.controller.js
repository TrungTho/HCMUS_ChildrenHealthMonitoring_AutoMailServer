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

  // sendCustomMail: async function (req, res) {
  //   try {
  //     console.log("---------------begin---------------");
  //     //get configs
  //     const timeString = req.body.timeString;
  //     const contents = req.body.contents;
  //     cron.schedule(
  //       timeString,
  //       () => {
  //         // globalFunction.sendMail();
  //         console.log(contents);
  //         // console.log(task, contents);
  //       },
  //       { scheduled: true, timezone: "Asia/Bangkok" }
  //     );
  //     return res.send({ success: true });
  //   } catch (error) {
  //     console.log("err:", error);
  //     return res.status(406).send({ success: false, error });
  //   }
  // },

  //--------------------------custom task in array

  pushNewTaskToArray: async function (req, res) {
    try {
      // console.log("---------------begin---------------");

      //get configs
      const timeString = req.body.timeString;
      const contents = req.body.contents;

      console.log(
        "acdd new remider for " +
          contents.clientEmail +
          " eventId: " +
          req.body.eventId
      );

      scheduleTaskMdw.arrayTask.push({
        eventId: req.body.eventId, //id of event for finding & modifying after
        task: cron.schedule(
          timeString,
          () => {
            //log for debuging
            // console.log(contents);

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

      // console.log(scheduleTaskMdw.arrayTask);
      console.log("add new remider finish!! ");

      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  destroyTaskInArray: async function (req, res) {
    try {
      console.log("body", req.body);
      const index = scheduleTaskMdw.arrayTask.findIndex(
        (element) => String(element.eventId) === String(req.body.eventId)
      );
      console.log("index", index);
      scheduleTaskMdw.destroyTaskInArray(index);
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  stopTaskInArray: async function (req, res) {
    try {
      console.log("body", req.body);
      const index = scheduleTaskMdw.arrayTask.findIndex(
        (element) => String(element.eventId) === String(req.body.eventId)
      );
      console.log("index", index);

      //stop old running task
      scheduleTaskMdw.stopTaskInArray(index);

      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  updateTaskInArray: async function (req, res) {
    try {
      console.log("update body", req.body);
      const timeString = req.body.timeString;
      const contents = req.body.contents;

      const index = scheduleTaskMdw.arrayTask.findIndex(
        (element) => String(element.eventId) === String(req.body.eventId)
      );
      console.log("index", index);

      //first: stop old running task
      scheduleTaskMdw.stopTaskInArray(index);

      //second: update new status for task
      if (index > -1 && index < scheduleTaskMdw.arrayTask.length) {
        scheduleTaskMdw.arrayTask[index].task = cron.schedule(
          timeString,
          () => {
            //log for debuging
            console.log("update content", contents);

            //call fucntion to send mail
            globalFunction.sendMail(
              contents.clientFullname,
              contents.clientEmail,
              contents.diaryName,
              contents.emailContents
            );
          },
          { scheduled: true, timezone: "Asia/Bangkok" }
        );
      }

      console.log(
        "update remider for " +
          contents.clientEmail +
          " eventId: " +
          req.body.eventId
      );
      return res.send({ success: true });
    } catch (error) {
      return res.status(406).send({ success: false, error });
    }
  },

  getArrayTask: async function (req, res) {
    try {
      console.log("array: ", scheduleTaskMdw.arrayTask);
      return res.send({
        success: true,
        counter: scheduleTaskMdw.arrayTask.length,
      });
    } catch (error) {
      console.log(error);
      return res.status(406).send({ success: false, error });
    }
  },

  resetArrayTask: async function (req, res) {
    try {
      //call function to stop and destroy all task in  array task
      scheduleTaskMdw.resetArrayTask();

      console.log("array: ", scheduleTaskMdw.arrayTask);
      return res.send({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(406).send({ success: false, error });
    }
  },
};
