const db = require("../utils/database");
const TABLE_NAME = "diary_vaccine";

module.exports = {
  //---------------------default query----------------------------
  getAll() {
    return db.load(`select * from ${TABLE_NAME} and isDel=false`);
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
  //get an single user by user id
  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where id = ${id} and isDel=false`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  //get diary id by event's id to authentication
  async getIdDiary(id) {
    const rows = await db.load(
      `select id_diary from ${TABLE_NAME} where id = ${id} and isDel=false`
    );
    if (rows.length === 0) return null;
    return rows[0].id_diary;
  },

  getAllByDiaryId(id) {
    return db.load(
      `select * from ${TABLE_NAME} where id_diary=${id} and isDel=false`
    );
  },

  //select all vaccine event reminder in day to schedule noti
  getAllReminderInDay(id) {
    return db.load(
      `SELECT * FROM ${TABLE_NAME}
      WHERE Month(remindDate) = Month(CURDATE()) AND year(remindDate) = year(CURDATE()) and  Day(remindDate) = day(CURDATE()) and isRemind=true;`
    );
  },

  //---------------------others update----------------------------

  //function to update avatar link with id and link
  setAvatar(id, link) {
    return db.load(
      `update ${TABLE_NAME} set image='${link}' where id=${id} and isDel=false`
    );
  },

  //function delete event "logically"
  setDelete(id) {
    return db.load(`update ${TABLE_NAME} set isDel=true where id=${id}`);
  },
};
