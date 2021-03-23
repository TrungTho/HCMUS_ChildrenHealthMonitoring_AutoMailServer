const db = require("../utils/database");
const TABLE_NAME = "user";

module.exports = {
  //---------------------default query----------------------------
  getAll() {
    return db.load(
      `select * from ${TABLE_NAME} where username != '${process.env.ADMIN_USERNAME}'` //you will never can get data of admin from server
    );
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { id: Obj.id };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { id: Obj.id };
    return db.update(Obj, condition, TABLE_NAME);
  },

  //---------------------others select----------------------------
  getAllBasisUser() {
    return db.load(`select * from ${TABLE_NAME} where permission=0`);
  },

  getAllEditor() {
    return db.load(`select * from ${TABLE_NAME} where permission=2`);
  },

  //get an single user by user id
  async getSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where id = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByUsername(username) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where username = "${username}" and isDisable = 0`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByEmail(email) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where email = "${email}" `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getPassByUsername(username) {
    const rows = await db.load(
      `select password from ${TABLE_NAME} where username = "${username}" `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  //---------------------others update----------------------------

  //function to flip state disable
  flipDisable(id) {
    return db.load(
      `update ${TABLE_NAME} set isdisable=not(isdisable) where id=${id} and username != '${process.env.ADMIN_USERNAME}'`
    );
  },

  //function to set isVerified = true
  setVerified(id) {
    return db.load(`update ${TABLE_NAME} set isverified =true where id=${id}`);
  },

  //function to set isVerified = true
  setAvatar(id, link) {
    return db.load(`update ${TABLE_NAME} set avatar ='${link}' where id=${id}`);
  },
};
