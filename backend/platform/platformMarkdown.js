const { databaseAPI, gitlabAPI } = require('../API/API')

/**
 * @class
 *
 * platformMarkdown: using for handling request about getting/setting markdown content
 */

class platformMarkdown {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Connection} con - mysql connection
   * @param {Object} config - config file setting
   */
  init (router, con, config) {
    /**
     * Request for getting markdown content
     *
     * @name get/markdownContent
     * @param {string} req.query.page - the page content wonna get
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/markdownContent', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let markdownContent = await databaseAPI.getMarkdownContent(con, req.query.page)
        console.log(`\x1b[32m${new Date().toISOString()} [platformMarkdown operating] getting markdown content successful\x1b[0m`)
        res.status(200).end(JSON.stringify(markdownContent))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformMarkdown operating error] getting markdown content error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for updating markdown content
     *
     * @name post/markdownContent
     * @param {string} req.body.token - gitlab access token
     * @param {string} req.body.page - the page is going to update
     * @param {string} req.body.content - the content wonna update
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.post('/markdownContent', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        /* first checking user access right */
        let userData = await gitlabAPI.getUserData(config.hostname, req.body.token)
        if (!userData.is_admin) {
          console.error(`\x1b[31m${new Date().toISOString()} [platformMarkdown operating error] setting markdown content failed: permission denied\x1b[0m`)
          res.status(401).end(JSON.stringify('Updating markdown content error: Permission denied')) // 401 unauthorized
        } else {
          let result = await databaseAPI.setMarkdownContent(con, req.body.page, JSON.stringify(req.body.content))
          console.log(`\x1b[32m${new Date().toISOString()} [platformMarkdown operating] setting markdown content successful\x1b[0m`)
          res.status(200).end(JSON.stringify(result))
        }
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformMarkdown operating error] setting markdown content error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
  }
}

module.exports = { platformMarkdown }
