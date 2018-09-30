const { gameDatabaseAPI } = require('../API/API')

/**
 * @class
 *
 * pd2royaleBattleField: Handling request for pd2royale game
 */
class pd2royaleBattleField {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Connection} con - database connection
   * @param {Object} config - config file setting
   */
  init (router, con, config) {
    /**
     * Request for getting user register status
     *
     * @name get/userRegisterStatus
     * @param {string} user - user name
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/userRegisterStatus', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let status = await gameDatabaseAPI.getUserRegisterStatus(con, req.query.user)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] getting ${req.query.user} status successful\x1b[0m`)
        res.status(200).end(JSON.stringify(status))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] getting ${req.query.user} status error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for user register
     *
     * @name get/register
     * @param {string} user - user name
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/register', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let result = await gameDatabaseAPI.userRegister(con, req.query.user)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] ${req.query.user} register successful\x1b[0m`)
        res.status(200).end(JSON.stringify(result))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] ${req.query.user} register error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    router.get('/memberList', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let memberList = await gameDatabaseAPI.getMemberList(con)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] getting member list successful\x1b[0m`)
        res.status(200).end(JSON.stringify(memberList))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] getting member list error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
  }
}

module.exports = { pd2royaleBattleField }