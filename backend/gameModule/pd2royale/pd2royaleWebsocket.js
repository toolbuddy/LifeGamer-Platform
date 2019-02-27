const WebSocket = require('ws')
const fs = require('fs')
const { gameDatabaseAPI } = require('../../API')
const { pd2royaleELO } = require('./pd2royaleELO')

/**
 * @class
 *
 * pd2royaleWebsocket: Creating websocket server for pd2royale game data transfer
 */

class pd2royaleWebsocket {
  /**
   * @constructor
   */
  constructor () {
    this.socketpool = {}
  }
  /**
   * init websocket
   *
   * @param {Object} router - router
   * @param {Connection} con - pd2royale mysql connection
   * @param {number} port - websocket port
   */
  init (router, con, port) {
    const wss = new WebSocket.Server({ port: port })
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        let data = JSON.parse(message)
        switch (data.method) {
          case 'register': // client register
            this.socketpool[data.token] = ws
            break
          case 'unregister': // client exit
            delete this.socketpool[data.token]
            break
          default: break
        }
      })
    })
    /**
     * Request for posting game data
     *
     * @name post/game
     * @param {string} req.body.p1 - player 1
     * @param {string} req.body.p2 - player 2
     * @param {string} req.body.result - game result, showing who win
     * @param {number} req.body.level - judge level
     * @param {string} req.body.data - judge game data
     */
    router.post('/game', async (req, res) => {
      res.set('Content-Type', 'application/json')
      if (req.body.level === 'battle') {
        if (req.body.p1 !== 'p1' && req.body.p2 !== 'p2') {
          await pd2royaleELO.calculate(con, req.body.p1, req.body.p2, req.body.result)
          await gameDatabaseAPI.setUserEnemy(con, req.body.p1, 'none')
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale operating] updating user ELO successful\x1b[0m`)
        }
      } else {
        this.socketpool[req.body.token].send(
          JSON.stringify({'level': 'level' + req.body.level, 'data': req.body.data}))
        console.log(`\x1b[32m${new Date().toISOString()} [pd2royale operating] sending ${req.body.token} judging data\x1b[0m`)
      }
      res.end()
    })
  }
  /**
    * The function writting config for posting pipeline
    *
    * @function
    * @param {string} username - user name
    * @param {string} sha - commit sha
    * @param {string} token - gitlab access token
    * @returns {promise<Object>} the promise contains operating message
    * @resolve {string} message that written successful
    * @reject {error} FileSystem error
    */
  writeConfig (username, sha, token) {
    return new Promise((resolve, reject) => {
      let data = `SHA=${sha}\nTOKEN=${token}`
      fs.writeFile(`/tmp/${username}`, data, error => {
        if (error) {
          console.log(`\x1b[31m${new Date().toISOString()} [pd2royale operating error] writing config error\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [pd2royale operating]writing config successful\x1b[0m`)
          resolve('config written successful')
        }
      })
    })
  }
}

module.exports = { pd2royaleWebsocket }
