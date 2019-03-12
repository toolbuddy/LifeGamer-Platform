const config = require('../../config/config')[process.env.NODE_ENV]
const { gitlabAPI, databaseAPI } = require('../API')
const fs = require('fs')

Date.prototype.pattern = function (fmt) {
  fmt = new Date((fmt - fmt.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace(/[A-Z]/g, ' ')
  return fmt
}

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
    router.get('/branchList', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let branchlist = await gitlabAPI.getBranchList(config.hostname, projectID, req.query.token)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting branch list successful\x1b[0m`)
        res.status(200).end(JSON.stringify(branchlist))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting branch list error\nerror message: ${error}\x1b[0m`)
        res.end(error)
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
        res.end(error)
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
        res.end(error)
      }
    })
    /**
     * Request for updating user's grade
     *
     * @name get/updateGrade
     * @param {string} req.query.token - user's gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/updateGrade', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let userData = await gitlabAPI.getUserData(config.hostname, req.query.token)
        let projectID = await gitlabAPI.getProjectID(config.hostname, userData.id, config.projectName, req.query.token)
        let latestPipeline = await gitlabAPI.getLatestPipeline(config.hostname, projectID, req.query.token)
        latestPipeline = await gitlabAPI.getPipelineJobs(config.hostname, projectID, latestPipeline[0].id, req.query.token)
        latestPipeline = await this.pipelineSorting(latestPipeline)
        let bestScore = await databaseAPI.getUserGrade(con, userData.username)
        if (latestPipeline.score > bestScore) {
          let result = await databaseAPI.setUserGrade(con, userData.username, latestPipeline.score)
          console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] updating user grade successful\x1b[0m`)
          res.status(200).end(JSON.stringify(result))
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] updating user grade successful(not updated)\x1b[0m`)
          res.status(200).end('Not Modified')
        }
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] updating user grade error\nerror message: ${error}\x1b[0m`)
        res.end(error)
      }
    })
    /**
     * Request for getting latest pipeline and its jobs
     *
     * @name get/latestPipelineJobs
     * @param {number} req.query.userID - user's gitlab user ID
     * @param {string} req.query.token - user's gitlab access token
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/latestPipelineJobs', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let latestPipeline = await gitlabAPI.getLatestPipeline(config.hostname, projectID, req.query.token)
        latestPipeline = await gitlabAPI.getPipelineJobs(config.hostname, projectID, latestPipeline[0].id, req.query.token)
        latestPipeline = await this.pipelineSorting(latestPipeline)
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting latest pipeline and jobs successful\x1b[0m`)
        res.status(200).end(JSON.stringify(latestPipeline))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting latest pipeline and jobs error\nerror message: ${error}\x1b[0m`)
        res.end(error)
      }
    })
    /**
     * Request for getting pipelines and jobs of them
     *
     * @name get/pipelinejobs
     * @param {number} req.query.userID - user ID
     * @param {string} req.query.token - gitlab access token
     * @param {number} req.query.page - the page number user wonna getting, 10 records per page
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
          pipelinejobs.push(await this.pipelineSorting(pipelinejob))
        }
        console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] getting pipeline and jobs successful\x1b[0m`)
        res.status(200).end(JSON.stringify(pipelinejobs))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] getting pipeline and jobs error\nerror message: ${error}\x1b[0m`)
        res.end(error)
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
        let latestPipeline = await gitlabAPI.getLatestPipeline(config.hostname, projectID, req.query.token)
        console.log(latestPipeline)
        if (typeof(latestPipeline) === 'object') {
          if (latestPipeline[0].status === 'pending' || latestPipeline[0].status === 'running') {
            console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] judging error\nerror message: gitlab CI have not finished judging yet.\x1b[0m`)
            res.status(500).end('server have not finished judging yet')
          } else {
            await this.writeConfig(req.query.username, req.query.sha, req.query.token)
            let result = await gitlabAPI.postPipeline(config.hostname, projectID, req.query.branch, req.query.token)
            console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] judgment creating successful\x1b[0m`)
            res.status(200).end(JSON.stringify(result))
          }
        } else {
          await this.writeConfig(req.query.username, req.query.sha, req.query.token)
          let result = await gitlabAPI.postPipeline(config.hostname, projectID, req.query.branch, req.query.token)
          console.log(`\x1b[32m${new Date().toISOString()} [platformJudge operating] judgment creating successful\x1b[0m`)
          res.status(200).end(JSON.stringify(result))
        }
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformJudge operating error] judging error\nerror message: ${error}\x1b[0m`)
        res.end(error)
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
  /**
   * The function sorting pipeline data
   *
   * pipeline format
   * {
   *  id,
   *  stages: [],
   *  time,
   *  artifact_id,
   *  score,
   *  stage1: [{ name, status }],
   *  ...
   * }
   *
   * @param {Object} pipelineJobs - pipeline with jobs before sorting,
   * @returns {Promise<Object>} the promise contains pipeline done sorted,
   * @resolve {Object} pipeline done sorted
   */
  pipelineSorting (pipelineJobs) {
    return new Promise(resolve => {
      // initialize pipeline format
      let datetime = new Date(pipelineJobs[0].created_at)
      let doneSorted = {
        id: pipelineJobs[0].pipeline.id,
        time: datetime.pattern(datetime),
        artifact_id: pipelineJobs[0].id,
        status: pipelineJobs[pipelineJobs.length - 1].status,
        stages: [],
        score: 0
      }
      // modify job stage, name, and status
      for (let job of pipelineJobs) {
        if (doneSorted.hasOwnProperty(job.stage)) {
          doneSorted[job.stage].push({ name: job.name, id: job.id, status: job.status })
        } else {
          doneSorted.stages.push(job.stage)
          doneSorted[job.stage] = [{ name: job.name, id: job.id, status: job.status }]
        }
      }
      // modify pipeline score
      if (doneSorted.status === 'running' || doneSorted.status === 'pending') {
        doneSorted.score = 'running'
      } else {
        for (let stage of doneSorted.stages) {
          for (let job of doneSorted[stage]) {
            doneSorted.score += (job.status === 'success') ? config.stageScore[job.name] : 0
          }
        }
      }

      resolve(doneSorted)
    })
  }
}

module.exports = { platformJudge }
