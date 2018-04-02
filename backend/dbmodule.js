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
      database: config.db_database
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
      let sql = `SELECT * FROM web_content WHERE page = '${page}'`;
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
      let sql = `UPDATE web_content SET content = '${content}' WHERE page = '${page}'`;
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
  getCommitTable(user) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from commit_table WHERE user = '${user}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
  insertCommitTable(pipelineID, user, sha) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT into commit_table(pipelineID, user, sha) VALUES ('${pipelineID}', '${user}', '${sha}')`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        console.log("commit table updated");
        resolve("true");
      });
    });
  }
  getServerStatus() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from server_status`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        resolve(result[0].status);
      });
    });
  }
  getUserRegisterStatus(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from user_register WHERE studentID = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        resolve(result[0].status);
      });
    });
  }
  setUserRegisterStatus(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET status = 'registered' WHERE studentID = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject("false");
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
  /* get all list except user who want to search */
  getBattleList(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from user_register where status = 'registered' ORDER BY elo DESC`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
  getUserELO(studentID) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT elo from user_register where studentID = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        resolve(result[0]);
      });
    });
  }
  setUserELO(studentID, elo) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET elo = ${elo} where studentID = '${studentID}'`;
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
  /* user Attack, set user inAttack to true */
  userAttacktoggle(studentID, enemy) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET attackWho = '${enemy}' where studentID = '${studentID}'`;
      console.log(sql);
      this.con.query(sql, (error, result) => {
        if (error) reject(error);
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
}

module.exports = {
  DBModule: new DBModule()
};
