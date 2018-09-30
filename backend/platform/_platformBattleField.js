const { gitlabAPI, databaseAPI } = require('./API/API')

/**
 * @class
 *
 * platformBattleField: handling request about battle
 */

class _platformBattleField {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Connection} con - mysql connection
   * @param {Object} config - config file setting
   */
  init (router, con, config) {
    router.get('', async (req, res) => {

    })
  }
}

module.exports = { _platformBattleField }