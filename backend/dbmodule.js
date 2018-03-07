const mysql = require("mysql");
const request = require("request");
const config = require("../config/config");

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
  getUserScore(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from users WHERE id = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject("Error querying database");
        resolve(result[0].score);
      });
    });
  }
  setUserScore(studentID, score) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET score = '${score}' WHERE id = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject("false");
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
  getUserHistory(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from history ORDER by 'datetime' DESC WHERE id = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject("Error querying database");
        resolve(result);
      });
    });
  }
  insertUserHistory(name, studentID, datetime, score) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT into history(name, id, datetime, score) VALUES ('${name}','${studentID}','${datetime}',${score})`;
      this.con.query(sql, (error, result) => {
        if (error) reject("false");
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
}

module.exports = {
  DBModule: new DBModule()
};
