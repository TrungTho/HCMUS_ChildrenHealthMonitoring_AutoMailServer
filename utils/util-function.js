const { json } = require("express");
const moment = require("moment");
const diaryModel = require("../models/diary.model");
const inoculateModel = require("../models/inoculate.model");
const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

function buildMailContent(listOfVaccines) {
  // console.log(email);
  let details = "",
    count = 1;
  for (element of listOfVaccines) {
    details +=
      "<p><strong>" +
      count++ +
      ". " +
      element.vaccine +
      "</strong>" +
      " (" +
      element.note +
      ") </p>";
  }
  return details;
  // console.log(details);
}

function sendMail(clientFullname, clientEmail, diaryName, emailContents) {
  try {
    //send email confirm
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.CONTACT_EMAIL,
      to: clientEmail,
      subject: "[CHM-Team] Thông báo chủng ngừa Vaccine",
      html: `<h4>Xin ch&agrave;o Anh/ Chị ${clientFullname},</h4>
      <p>Email n&agrave;y được gửi tự động từ hệ thống Children Monitoring Health để hỗ trợ người d&ugrave;ng về lịch ti&ecirc;m ph&ograve;ng cho trẻ.&nbsp;</p>
      <p>Hệ thống xin được th&ocirc;ng b&aacute;o đến Anh/ Chị những lịch ti&ecirc;m ph&ograve;ng sau cho b&eacute;<strong> ${diaryName}</strong>:</p>
      ${emailContents}
      <p>Mong Anh/ Chị d&agrave;nh ra thời gian để c&oacute; thể kịp thời chủng ngừa những loại bệnh tr&ecirc;n, nếu đ&atilde; chủng ngừa vui l&ograve;ng bỏ qua email n&agrave;y!</p>
      <p>Xin cám ơn!</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendNotificationMail: async function () {
    console.log("begin");
    //create variable to keep today's date
    const currentDate = new Date();

    let countSentEmail = 0;

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
        let user = await userModel.getSingle(diary.id_user);
        //call function to send email
        sendMail(
          user.fullname,
          user.email,
          diary.fullname,
          buildMailContent(listVaccineToInject)
        );
        //set lasttimeemail to this month to ingnore next time query in the same month
        // await diaryModel.setLastTimeMail(element.id, currentDate.getMonth());

        //increase number of sent email
        countSentEmail++;
      }
    }

    console.log("end");

    return countSentEmail;
  },
};
