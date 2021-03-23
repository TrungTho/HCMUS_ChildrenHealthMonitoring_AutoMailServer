//middleware function to check right of client to access profile

module.exports = function adminAuth(req, res, next) {
  if (req.user.username === process.env.ADMIN_USERNAME) {
  } else {
    return res
      .status(403)
      .send({ success: false, err_message: "invalid request" });
  }

  next();
};
