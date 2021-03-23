const mysql = require("mysql");
const util = require("util");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 50,
});

const poolQuery = util.promisify(pool.query).bind(pool);

module.exports = {
  load(myQuery) {
    return poolQuery(myQuery);
  },

  add(newObj, tableName) {
    return poolQuery(`insert into ${tableName} set ?`, newObj);
  },

  del(condition, tableName) {
    return poolQuery(`delete from ${tableName} where ?`, condition);
  },

  update(Obj, condition, tableName) {
    return poolQuery(`update ${tableName} set ? where ?`, [Obj, condition]);
  },
};
