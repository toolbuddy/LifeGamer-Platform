const mysql = require("mysql");
const request = require("request");
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
    app.get("/db_page", async (req, res) => {
      res.set("Content-Type", "application/json");
      let page = req.query.page;
      let data = await this.getBoardContent(page);
      res.end(data);
    });
    app.post("/db_page", async (req, res) => {
      let page = req.body.page;
      let content = req.body.content;
      let token = req.body.token;
      let isAdmin = await this.checkAdmin(token);
      let flag = null;
      if (isAdmin == "true") flag = await this.setBoardContent(page, content);
      else flag = "false";
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
  checkAdmin(cookie) {
    return new Promise((resolve, reject) => {
      let url = `https://hmkrl.com/gitlab/api/v4/user?access_token=${cookie}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        console.log(body);
        let result = JSON.parse(body);
        if (result.is_admin) resolve("true");
        else resolve("false");
      });
    });
  }
}

module.exports = {
  DBModule: new DBModule()
};
