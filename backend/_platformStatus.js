const { databaseAPI } = require('./databaseAPI')
const { gitlabAPI } = require('./_gitlabAPI')

/**
 * @class
 *
 * platformStatus: handling request about getting/toggling platform server status
 */

class _platformStatus {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Connection} con - mysql connection
   * @param {Object} config - config file setting
   */
  init (router, con, config) {
    /**
     * Request for getting server status
     *
     * @name get/serverStatus
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/serverStatus', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let status = await databaseAPI.getServerStatus(con)
        console.log(`\x1b[32m${new Date().toISOString()} [platformStatus operating] getting server status successful\x1b[0m`)
        res.status(200).end(JSON.stringify(status))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformStatus operating error] getting server status error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for toggling platform server status
     *
     * @name get/toggleStatus
     * @param {string} req.query.token - gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/toggleStatus', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        /* first checking user access right */
        let userData = await gitlabAPI.getUserData(config.hostname, req.body.token)
        if (!userData.is_admin) {
          console.error(`\x1b[31m${new Date().toISOString()} [platformStatus operating error] toggling server status failed: permission denied\x1b[0m`)
          res.status(401).end(JSON.stringify('toggling server status error: Permission denied')) // 401 unauthorized
        } else {
          let result = await databaseAPI.toggleServerStatus(con)
          console.log(`\x1b[32m${new Date().toISOString()} [platformStatus operating] toggling server status successful\x1b[0m`)
          res.status(200).end(JSON.stringify(result))
        }
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformStatus operating error] getting server status error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
  }
}

module.exports = { _platformStatus }