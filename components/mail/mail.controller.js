const vaccineModel = require("../../models/inoculate.model");

module.exports = testController = {
  testFullText: async function (req, res) {
    const query = req.query.a;
    const ret = await vaccineModel.searchAll(query);
    res.send(ret);
  },

  logConnectionStats: async function (req, res) {
    const item = {
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    // console.log(item);
    res.send(item);
  },
};
