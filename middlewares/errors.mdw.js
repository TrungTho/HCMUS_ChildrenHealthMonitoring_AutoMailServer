module.exports = function (app) {
  //default route
  app.use(function (req, res) {
    res.send("404");
  });

  // false url err
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send("500");
  });
};
