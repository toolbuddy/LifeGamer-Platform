const mysql = require('mysql')

var pd2royaleDatabaseAPI = {
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
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB connect error] connection error: \nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB connect] mysql connecting successful\x1b[0m`)
          resolve(con)
        }
      })
    })
  },
  /**
   * getting user register status: registered or unregistered
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - user name
   * @returns {Promise<string>} A promise contains the user register status
   * @resolve {string} user register status
   * @rejects {error} MysqlError
   */
  getUserRegisterStatus (con, username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from user_register WHERE studentID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] getting ${username} register status error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] getting ${username} register status successful\x1b[0m`)
          resolve(result[0].status)
        }
      })
    })
  },
  /**
   * setting user register status into 'registered'
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - username
   * @returns {Promise<Object>} A promise contains mysql operating result
   * @resolve {Object} mysql operating result
   * @reject {error} MysqlError
   */
  userRegister (con, username) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET status = 'registered' WHERE studentID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] setting ${username} register status error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] setting ${username} register status successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting all member list
   *
   * @param {Connection} con - mysql database connection
   * @returns {Promise<Object>} A promise contains member list
   * @resolve {Object} member list
   * @reject {error} MysqlError
   */
  getMemberList (con) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from user_register where status = 'registered' ORDER BY elo DESC`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] getting member list error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] getting member list successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * getting user ELO
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - user name
   * @returns {Promise<number>} A promise contains user's elo
   * @resolve {number} user's elo
   * @reject {error} MysqlError
   */
  getUserELO (con, username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from user_register where studentID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] getting ${username} elo error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] getting ${username} elo successful\x1b[0m`)
          resolve(result[0].elo)
        }
      })
    })
  },
  /**
   * updating user's elo
   *
   * @param {Connection} con - connection
   * @param {string} username - user name
   * @param {number} elo - user's elo
   */
  updateUserELO (con, username, elo) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET elo = ${elo} where studentID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] updating ${username} elo error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] updating ${username} elo successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  },
  /**
   * setting user attacking target
   *
   * @param {Connection} con - mysql database connection
   * @param {string} username - user name
   * @param {string} enemy - enemy name
   */
  setUserAttack (con, username, enemy) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE user_register SET attackWho = '${enemy}' where studentID = '${username}'`
      con.query(sql, (error, result) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [pd2royale DB operating error] setting ${username} attack target error: \nsql command: ${sql}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale DB operating] setting ${username} attack target successful\x1b[0m`)
          resolve(result)
        }
      })
    })
  }
}

module.exports = { pd2royaleDatabaseAPI }