const mysql = require("mysql");
const request = require("request");
const config = require("./config/config");

class DBModule {
  constructor() {
    /* setting connection */
    this.con = mysql.createConnection({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "lifegamer_platform"
    });
    /* create connection */
    this.con.connect(error => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("mysql connect");
    });
  }
  /* database operate */
  getBoardContent(page) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM markdown WHERE page = '${page}'`;
      this.con.query(sql, (error, result) => {
        if (error) {
          reject("Error querying database");
        }
        console.log(result);
        resolve(result[0].content);
      });
    });
  }
  setBoardContent(page, content) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE markdown SET content = '${content}' WHERE page = '${page}'`;
      console.log("sql: " + sql);
      this.con.query(sql, (error, result) => {
        if (error) {
          reject("false");
        }
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
}

module.exports = {
  DBModule: new DBModule()
};
