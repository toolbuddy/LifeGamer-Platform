const mysql = require('mysql')

var databaseAPI = {
  /**
   * create connection to mysql server
   *
   * @param {string} host - server's host
   * @param {string} user - mysql database username
   * @param {string} passwd - mysql database password
   * @param {string} db - mysql database name
   * @returns {Promise<Connection>} the promise contains mysql connection
   * @resolve {Connection} mysql connection
   * @reject {error} MysqlError
   */
  createConnect (host, user, passwd, db) {
    return new Promise((resolve, reject) => {
      let con = mysql.createConnection({
        host: host,
        user: user,
        password: passwd,
        database: db
      })
      /** connecting to database */
      con.connect(error => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB connect error] connection error: \nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB connect] mysql connecting successful\x1b[0m`)
          resolve(con)
        }
      })
    })
  },
  /**
   * getting markdown content: announce page or resource page
   *
   * @param {Connection} con - mysql connection
   * @param {string} page - page name(announce, resource)
   * @returns {Promise<string>} A promise contains the markdown content
   * @resolve {string} the markdown content
   * @rejects {error} MysqlError
   */
  getMarkdownContent (con, page) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM web_content WHERE page = '${page}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] getting ${page} markdown content error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] getting ${page} markdown content successful\x1b[0m`)
          resolve(result[0].content)
        }
      })
    })
  },
  /**
   * setting markdown content: announce page or resource page
   *
   * @param {Connection} con - mysql connection
   * @param {string} page - page name
   * @param {string} content - the markdown content
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  setMarkdownContent (con, page, content) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE web_content SET content = ${content} WHERE page = '${page}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] setting ${page} markdown content error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] setting ${page} markdown content successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting student grade
   *
   * @param {Connection} con - mysql connection
   * @param {string} user - username, is almost studentID
   * @returns {Promise<number>} the promise contains user's grade
   * @resolve {number} user's grade
   * @reject {error} MysqlError
   */
  getUserGrade (con, user) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from users WHERE id = '${user}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] getting ${user} grade error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] getting ${user} grade successful\x1b[0m`)
          resolve(result[0].score)
        }
      })
    })
  },
  /**
   * setting student grade(updating)
   *
   * @param {Connection} con - mysql connection
   * @param {string} user - username, is almost studentID
   * @param {number} grade - the grade is going to update
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  setUserGrade (con, user, grade) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET score = '${grade}' WHERE id = '${user}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] getting ${user} grade error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] setting ${user} grade successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting commit table
   *
   * commit table - recording the data about user, commit sha and pipelineID
   * because GitLabCI can only create the pipeline that run the latest code
   * version, needed to change to certain version that user assigned, so it
   * needs a table to record the pair of pipelineID and commit sha.
   *
   * @param {Connection} con - mysql connection
   * @param {string} user - username, is almost studentID
   * @returns {Promise<Object>} the promise contains commit table
   * @resolve {Object} commit table with json format(key: user, sha, pipelineID)
   * @reject {error} MysqlError
   */
  getCommitTable (con, user) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from commit_table WHERE user = '${user}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] getting ${user} commit table error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] getting ${user} commit table successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * inserting a row into commit table
   *
   * @param {Connection} con - mysql connection
   * @param {string} user - username, is almost studentID
   * @param {number} pipelineID - pipelineID
   * @param {string} sha - commit SHA
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  insertCommitTable (con, user, pipelineID, sha) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT into commit_table(pipelineID, user, sha) VALUES ('${pipelineID}', '${user}', '${sha}')`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] inserting ${user} data into commit table error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] inserting ${user} data into commit table successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting server status, on or off
   *
   * @param {Connection} con - mysql connection
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  getServerStatus (con) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from server_status`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] getting server status error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] getting server status successful\x1b[0m`)
          resolve(result[0].status)
        }
      })
    })
  },
  /**
   * toggle server status
   *
   * @async
   * @param {Connection} con - mysql connection
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  toggleServerStatus (con) {
    return new Promise(async (resolve, reject) => {
      let status = await this.getServerStatus(con)
      let sql = `UPDATE server_status SET status = ${status === 'on' ? 'off' : 'on'}`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [DB operating error] toggle server status error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [DB operating] toggle server status successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  }
}

module.exports = { databaseAPI }