const mysql = require('mysql')

class DBModule {
  constructor () {
    /* setting connection */
    this.con = mysql.createConnection({
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'lifegamer_platform'
    })
    /* create connection */
    this.con.connect(error => {
      if (error) {
        console.log(error)
        return
      }
      console.log('mysql connect')
    })
  }
  init (app) {
    app.get('/db_user', async (req, res) => {
      res.set('Content-Type', 'application/json')
      /* using query string to pass data */
      let method = req.query.method
      let id = null
      switch (method) {
        case "get":
          id = req.query.id;
          let data = await this.getUserData(id);
          res.end(data);
          break;
        case "set":
          id = req.query.id;
          let grade = req.query.grade;
          let flag = await this.setUserData(id, grade);
          res.end(flag);
          break;
        default:
          break
      }
    })
    app.get('/db_page', async (req, res) => {
      res.set('Content-Type', 'application/json')
      let method = req.query.method
      let page = null
      switch (method) {
        case "get":
          page = req.query.page;
          let data = await this.getBoardContent(page);
          console.log('data: ' +  data)
          res.end(data);
          break;
        case "set":
          page = req.query.page;
          let content = req.query.content;
          let flag = await this.setUserData(page, content);
          res.end(flag);
          break;
        default:
          break
      }
    })
  }
  /* database operate */
  getUserData(id) {
    let sql = `SELECT * FROM users WHERE id = '${id}'`;
    this.con.query(sql, (error, result) => {
      if (error) throw error
      return result[0].grade
    })
  }
  setUserData(id, grade) {
    let sql = `UPDATE users SET grade = '${grade}' WHERE id = '${id}'`;
    this.con.query(sql, (error, result) => {
      if (error) {
        throw error
      }
      console.log(result.affectedRows + ' record(s) updated')
      return true
    })
  }
  getBoardContent(page) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM markdown WHERE page = '${page}'`;
      this.con.query(sql, (error, result) => {
        if (error) {
          reject("Error querying database")
        }
        console.log(result)
        resolve(result[0].content)
      })
    })
  }
  setBoardContent(page, content) {
    let sql = `UPDATE markdown SET content = '${content}' WHERE page = '${page}'`;
    this.con.query(sql, (error, result) => {
      if (error) {
        throw error
      }
      console.log(result.affectedRows + ' record(s) updated')
      return true
    })
  }
}

module.exports = {
  DBModule: new DBModule()
}
