const { gitlabAPI } = require('../API/API')

/**
 * @class
 *
 * platformData: handling request for getting userdata
 */

class platformData {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Object} config - config file setting
   */
  init (router, config) {
    /**
     * Request for getting userdata
     *
     * @name get/userData
     * @param {string} req.query.token - gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/userData', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let userdata = await gitlabAPI.getUserData(config.hostname, req.query.token)
        console.log(`\x1b[32m${new Date().toISOString()} [platformData operating] getting user data successful\x1b[0m`)
        res.status(200).end(JSON.stringify(userdata))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformData operating error] getting user data error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
  }
}

module.exports = { platformData }
