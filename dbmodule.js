const https = require("https");
const mysql = require("mysql");

class DBModule {
  constructor() {
    /* setting connection */
    this.con = mysql.createConnection({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "lifegamer_platform"
    });
  }
  init(app) {
    app.get("/db_user", (req, res) => {
      /* using query string to pass data */
      let method = req.query.method;
      let id = null;
      switch (method) {
        case "get":
          id = req.query.id;
          let data = this.getUserData(id);
          res.end(data);
          break;
        case "set":
          id = req.query.id;
          let grade = req.query.grade;
          let flag = this.setUserData(id, grade);
          res.end(flag);
          break;
        default:
          break;
      }
    });
    app.get("/db_page", (req, res) => {
      let method = req.query.method;
      let page = null;
      switch (method) {
        case "get":
          page = req.query.page;
          let data = this.getBoardContent(page);
          res.end(data);
          break;
        case "set":
          page = req.query.page;
          let content = req.query.content;
          let flag = this.setUserData(page, content);
          res.end(flag);
          break;
        default:
          break;
      }
    });
  }
  /* database operate */
  getUserData(id) {
    this.con.connect(error => {
      if (error) throw error;
      let sql = `SELECT * FROM users WHERE id = '${id}'`;
      this.con.query(sql, (error, result) => {
        if (error) throw error;
        return result;
      });
    });
  }
  setUserData(id, grade) {
    this.con.connect(error => {
      if (error) {
        throw error;
        return false;
      }
      let sql = `UPDATE users SET grade = '${grade}' WHERE id = '${id}'`;
      this.con.query(sql, (error, result) => {
        if (error) {
          throw error;
          return false;
        }
        console.log(result.affectedRows + " record(s) updated");
        return true;
      });
    });
  }
  getBoardContent(page) {
    this.con.connect(error => {
      if (error) throw error;
      let sql = `SELECT * FROM markdown WHERE page = '${page}'`;
      this.con.query(sql, (error, result) => {
        if (error) throw error;
        return result;
      });
    });
  }
  setBoardContent(page, content) {
    this.con.connect(error => {
      if (error) {
        throw error;
        return false;
      }
      let sql = `UPDATE markdown SET content = '${content}' WHERE page = ${page}`;
      this.con.query(sql, (error, result) => {
        if (error) {
          throw error;
          return false;
        }
        console.log(result.affectedRows + " record(s) updated");
        return true;
      });
    });
  }
}

module.exports = {
  DBModule: new DBModule()
};
