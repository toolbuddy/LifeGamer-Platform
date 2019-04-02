const mysql = require('mysql')

var pd2sudokuDatabaseAPI = {
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
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase connect error] connection error: \nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase connect] mysql connecting successful\x1b[0m`)
          resolve(con)
        }
      })
    })
  },
  /**
   * getting user group: easy, hard, or unregistered
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - gitlab username
   * @returns {Promise<string>} A promise contains the user's group
   * @resolve {string} user's group
   * @rejects {error} MysqlError
   */
  getUserGroup (con, username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from users WHERE gitlabID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] getting ${username} group error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          if (result.length != 0) {
            console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] getting ${username} group successful\x1b[0m`)
            resolve(result[0].user_group)
          } else {
            console.error(`\x1b[31m${new Date().toISOstring()} [gameDatabase operating error] getting ${username} group error: \nerror message: ${username} not found.\x1b[0m`)
            reject('error')
          }
        }
      })
    })
  },
  /**
   * setting user group
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - gitlab username
   * @param {string} group - group, easy or hard
   * @returns {Promise<Object>} A promise contains mysql operating result
   * @resolve {Object} mysql operating result
   * @reject {error} MysqlError
   */
  updateUserGroup (con, username, group) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET user_group = '${group}' WHERE gitlabID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] setting ${username} group error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] setting ${username} group successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting all member list
   *
   * @param {Connection} con - mysql database connection
   * @param {string} group - group, easy or hard
   * @returns {Promise<Object>} A promise contains member list
   * @resolve {Object} member list
   * @reject {error} MysqlError
   */
  getMemberList (con, group) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from users where user_group = '${group}' ORDER BY ELO DESC`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] getting member list error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] getting member list successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting user ELO
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - gitlab username
   * @returns {Promise<number>} A promise contains user's elo
   * @resolve {number} user's elo
   * @reject {error} MysqlError
   */
  getUserELO (con, username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from users where gitlabID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] getting ${username} elo error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          if (result.length != 0) {
            console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] getting ${username} elo successful\x1b[0m`)
            resolve(result[0].ELO)
          } else {
            console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] getting ${username} elo error: \nerror message: ${username} not found.\x1b[0m`)
            reject('error')
          }
        }
      })
    })
  },
  /**
   * updating user's elo
   *
   * @param {Connection} con - connection
   * @param {string} username - gitlab username
   * @param {number} elo - user's elo
   * @returns {Promise<Object>} the promise contains sql execution result
   * @resolve {Object} Mysql execution result
   * @reject {error} MysqlError
   */
  updateUserELO (con, username, elo) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET ELO = ${elo} where gitlabID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] updating ${username} elo error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] updating ${username} elo successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  updateUserPreELO (con, username, preELO) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET pre_ELO = ${preELO} where gitlabID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gameDatabase operating error] updating ${username} pre elo error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gameDatabase operating] updating ${username} pre elo successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  }
}

module.exports = { pd2sudokuDatabaseAPI }
