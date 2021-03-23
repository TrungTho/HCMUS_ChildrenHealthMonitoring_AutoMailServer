const moment = require("moment");
const diaryModel = require("../models/diary.model");

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

module.exports = {
  sendNotificationMail: async function () {
    console.log("hehe");
    //create variable to keep today's date
    const currentDate = new Date();

    //get all diary's dob to compare
    const diaries = await diaryModel.getAllToSendMail();

    //calculate age of each diary (month)

    console.log(diaries);
  },
};
