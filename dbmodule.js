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
    /* create connection */
    this.con.connect(error => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("mysql connect");
    });
  }
  init(app) {
    app.get("/db_user", async (req, res) => {
      res.set("Content-Type", "application/json");
      /* using query string to pass data */
      let id = req.query.id;
      let data = await this.getUserData(id);
      res.end(data);
    });
    app.get("/db_page", async (req, res) => {
      res.set("Content-Type", "application/json");
      let page = req.query.page;
      let data = await this.getBoardContent(page);
      res.end(data);
    });
    app.post("/db_page", async (req, res) => {
      let page = req.body.page;
      let content = req.body.content;
      console.log("page:" + page);
      console.log("content:" + content);
      let flag = await this.setBoardContent(page, content);
      res.end(flag);
    });
    app.post("/db_user", async (req, res) => {
      let id = req.query.id;
      let grade = req.body.grade;
      let flag = await this.setUserData(id, grade);
      res.end(flag);
    });
  }
  /* database operate */
  getUserData(id) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM users WHERE id = '${id}'`;
      this.con.query(sql, (error, result) => {
        if (error) {
          reject("Error querying database");
        }
        resolve(result[0].grade);
      });
    });
  }
  setUserData(id, grade) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET grade = '${grade}' WHERE id = '${id}'`;
      this.con.query(sql, (error, result) => {
        if (error) {
          reject("false");
        }
        console.log(result.affectedRows + " record(s) updated");
        resolve("true");
      });
    });
  }
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
