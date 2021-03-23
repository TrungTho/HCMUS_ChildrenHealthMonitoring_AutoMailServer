const adminAuth = require("./auth/admin-auth.mdw");
// const passport = require("../middlewares/passport.mdw");

module.exports = function (app) {
  //--------------------client route-----------------
  app.use(
    "/vaccine-notification-mail",
    require("../components/mail/mail.route")
  );
};
