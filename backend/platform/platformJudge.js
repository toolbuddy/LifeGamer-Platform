const { gitlabAPI, databaseAPI } = require('../API/API')
const fs = require('fs')

/**
 * @class
 *
 * platformJudge: using for handling request about judge part from frontend.
 */
class platformJudge {
  /**
   * init the server request handler
   *
   * @param {Object} router - router
   * @param {Connection} con - mysql connection
   * @param {Object} config - config file setting
   */
  init (router, con, config) {
    /**
     * Request for getting branch list
     *
     * @name get/branchList
     * @param {number} req.query.userID - user ID
     * @param {string} req.query.token - gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('./branchList', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let branchlist = await gitlabAPI.getBranchList(config.hostname, projectID, req.query.token)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting branch list successful\x1b[0m`)
        res.status(200).end(JSON.stringify(branchlist))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting branch list error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for getting commit list
     *
     * @name get/commitList
     * @param {number} req.query.userID - user ID
     * @param {string} req.query.branch - the branch wonna getting commit data
     * @param {number} req.query.page - the page number user wonna getting, 20 records per page
     * @param {string} req.query.token - gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/commits', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let commitlist = await gitlabAPI.getCommits(config.hostname, projectID, req.query.branch, req.query.page, req.query.token)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting projectID successful\x1b[0m`)
        res.status(200).end(JSON.stringify(commitlist))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting commit list error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for getting commit table
     *
     * @name get/commitTable
     * @param {string} req.query.user - username
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/commitTable', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let commitTable = await databaseAPI.getCommitTable(con, req.query.user)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting commit table successful\x1b[0m`)
        res.status(200).end(JSON.stringify(commitTable))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting commit table error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for getting user's grade
     *
     * @name get/grade
     * @param {Connection} con - mysql connection
     * @param {string} req.query.user - username
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/grade', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let grade = await databaseAPI.getUserGrade(con, req.query.user)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting user grade successful\x1b[0m`)
        res.status(200).end(JSON.stringify(grade))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting user grade error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for posting user's grade
     *
     * @name post/grade
     * @param {string} req.body.user - username
     * @param {number} req.body.grade - the grade is going to be updated
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.post('/grade', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let result = await databaseAPI.setUserGrade(con, req.body.user, req.body.grade)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] updating user grade successful\x1b[0m`)
        res.status(200).end(JSON.stringify(result))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] updating user grade error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for getting pipelines and jobs of them
     *
     * @name get/pipelinejobs
     * @param {number} req.query.userID - user ID
     * @param {string} req.query.token - gitlab access token
     * @param {number} req.query.page - the page number user wonna getting, 20 records per page
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/pipelinejobs', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let pipelines = await gitlabAPI.getPipelines(config.hostname, projectID, req.query.page, req.query.token)
        // deal with every pipeline, getting jobs of them
        let pipelinejobs = []
        for (const pipeline of pipelines) {
          let pipelinejob = await gitlabAPI.getPipelineJobs(config.hostname, projectID, pipeline.id, req.query.token)
          pipelinejobs.push(pipelinejob)
        }
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting pipeline and jobs successful\x1b[0m`)
        res.status(200).end(JSON.stringify(pipelinejobs))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting pipeline and jobs error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for judging code
     *
     * @param {number} req.query.userID - user ID
     * @param {string} req.query.username - username
     * @param {string} req.query.sha - commit sha
     * @param {string} req.query.branch - branch name
     * @param {string} req.query.token - gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/judge', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        await this.writeConfig(req.query.username, req.query.sha, req.query.token)
        let result = await gitlabAPI.postPipeline(config.hostname, projectID, req.query.branch, req.query.token)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] judgment creating successful\x1b[0m`)
        res.status(200).end(JSON.stringify(result))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] judging error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
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
          console.log(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] writing config error\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating]writing config successful\x1b[0m`)
          resolve('config written successful')
        }
      })
    })
  }
}

module.exports = { platformJudge }