const { json } = require("express");
const moment = require("moment");
const diaryModel = require("../models/diary.model");
const inoculateModel = require("../models/inoculate.model");
const userModel = require("../models/user.model");

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

function buildMailContent(email, listOfVaccines) {
  console.log(email);
  let details = [],
    count = 1;
  for (element of listOfVaccines) {
    details.push(count++ + ". " + element.vaccine + " (" + element.note + ") ");
  }
  console.log(details);
}

module.exports = {
  sendNotificationMail: async function () {
    console.log("begin");
    //create variable to keep today's date
    const currentDate = new Date();

    //get all diary's dob to compare
    const diaries = await diaryModel.getAllToSendMail(currentDate.getMonth());

    //get milestones of incjection from db to compare with diary's dob
    const singleAges = await inoculateModel.getAllInjectionAgeWithoutLoopSpan();
    const loopAges = await inoculateModel.getAllLoopSpanInjection();

    //calculate age of each diary (month)
    for (diary of diaries) {
      let totalMonthAge = monthDiff(new Date(diary.dob), currentDate);

      // console.log(totalMonthAge);

      let listVaccineToInject = [];

      //check for injection without looping time
      if (
        singleAges.findIndex(
          (element) => parseInt(element.injectionAge) === totalMonthAge
        ) === -1
      ) {
      } else {
        //get all vaccine need to be injected
        listVaccineToInject = await inoculateModel.getAllVaccineByInjectionAge(
          totalMonthAge
        );
      }

      //check for injection with looping time
      for (element of loopAges) {
        try {
          if (
            (totalMonthAge - parseInt(element.injectionAge)) %
              parseInt(element.loopSpan) ===
            0
          ) {
            const vaccine = await inoculateModel.getSingle(element.id);
            listVaccineToInject.push(vaccine);
            // console.log("in", listVaccineToInject);
          } else {
          }
        } catch (error) {
          throw error;
        }
      }

      //check if that diary has any vaccine need to be injected
      if (listVaccineToInject.length !== 0) {
        //get email of diary's owner
        let userEmail = await userModel.getEmailById(diary.id_user);
        //call function to send email
        await buildMailContent(userEmail, listVaccineToInject);
        //set lasttimeemail to this month to ingnore next time query in the same month
        //await diaryModel.setLastTimeMail(element.id, currentDate.getMonth());
      }
    }

    //console.log(diaries);
    console.log("end");
  },
};
