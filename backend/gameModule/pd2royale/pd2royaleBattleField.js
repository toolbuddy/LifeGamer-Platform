const shell = require('shelljs')
const fs = require('fs')
const exec = require('child_process')
const { gitlabAPI, gameDatabaseAPI } = require('../../API')

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
     * @param {string} req.query.user - user name
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
     * @param {string} req.query.user - user name
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
    /**
     * Request for getting member list
     *
     * @name get/memberList
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
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
    /**
     * Request for getting artifact
     *
     * @name get/artifact
     * @param {number} req.query.userID - user ID
     * @param {number} req.query.jobID - the job ID, download artifact file needed
     * @param {string} req.query.token - gitlab access token
     * @param {string} req.query.user - user name
     * @param {string} req.query.mode - save file mode, attack, defend, or both
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/artifact', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        let result = null
        if (req.query.mode === 'both') {
          result = await gitlabAPI.getArtifact(config.hostname, projectID, req.query.jobID, req.query.token, 'player', '/home/pd2royale', `${req.query.user}_defend`)
          await gitlabAPI.getArtifact(config.hostname, projectID, req.query.jobID, req.query.token, 'player', '/home/pd2royale', `${req.query.user}_attack`)
        } else {
          result = await gitlabAPI.getArtifact(config.hostname, projectID, req.query.jobID, req.query.token, 'player', '/home/pd2royale', `${req.query.user}_${req.query.mode}`)
        }
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] getting artifact successful\x1b[0m`)
        res.status(200).end(JSON.stringify(result))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] getting artifact error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for battle
     *
     * @name get/battle
     * @param {string} req.query.user - user name
     * @param {string} req.query.enemy - enemy name
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/battle', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        await gameDatabaseAPI.setUserEnemy(con, req.query.user, req.query.enemy)
        /* if folder not exist, create one */
        if (!fs.existsSync('/home/pd2royale/battleFile')) shell.exec('mkdir /home/pd2royale/battleFile')
        let time = new Date().toISOString()
        /**
         * setting shell command
         *
         * 1. copy user and enemy file into 'battleFile' folder, prevent the file read more than once at the same time
         * 2. execute the CR_battle battle engine beginning the battle
         */
        let shellCommand = `cp /home/pd2royale/${req.query.user}_attack /home/pd2royale/battleFile/${req.query.user}_${time} && cp /home/pd2royale/${req.query.enemy}_defend /home/pd2royale/battleFile/${req.query.enemy}_${time} && CR_battle -1 ${req.query.user} -2 ${req.query.enemy} /home/pd2royale/battleFile/${req.query.user}_${time} /home/pd2royale/battleFile/${req.query.enemy}_${time} &> /dev/null`
        exec.exec(shellCommand, (err, stdout, stderr) => {
          if (err) {
            console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] starting battle error\nerror message: ${err}\x1b[0m`)
            res.status(500).end(err) // internal server error
          }
        })
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] starting battle successful\x1b[0m`)
        res.status(200).end('Starting battle successful!')
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] starting battle error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
  }
}

module.exports = { pd2royaleBattleField }
