const shell = require('shelljs')
const fs = require('fs')
const exec = require('child_process')
const { gitlabAPI, gameDatabaseAPI } = require('../../API')
const { pd2sudokuELO } = require('./pd2sudokuELO')

/**
 * @class
 *
 * pd2sudokuBattleField: Handling request for pd2sudoku game
 */
class pd2sudokuBattleField {
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
     * @name get/userGroup
     * @param {string} req.query.user - gitlab username
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/userGroup', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let group = await gameDatabaseAPI.getUserGroup(con, req.query.user)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] getting ${req.query.user} group successful\x1b[0m`)
        res.status(200).end(group)
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] getting ${req.query.user} group error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for user select group
     *
     * @name get/updateGroup
     * @param {string} req.query.user - gitlab username
     * @param {string} req.query.group - easy or hard
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/updateGroup', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let result = await gameDatabaseAPI.updateUserGroup(con, req.query.user, req.query.group)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] updating ${req.query.user} group successful\x1b[0m`)
        res.status(200).end(JSON.stringify(result))
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] updating ${req.query.user} group error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    /**
     * Request for getting member list
     *
     * @name get/memberList
     * @param {string} group - easy or hard
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/memberList', async (req, res) => {
      res.set('Content-Type', 'application/json')
      let memberList = null
      try {
        if (req.query.group === 'both') {
            let basic = await gameDatabaseAPI.getMemberList(con, 'basic')
            let advanced = await gameDatabaseAPI.getMemberList(con, 'advanced')
            memberList = { 'basic': basic, 'advanced': advanced }
        } else {
            memberList = await gameDatabaseAPI.getMemberList(con, req.query.group)
        }
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
     * @param {string} req.query.user - gitlab username
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/artifact', async (req, res) => {
      res.set('Content-Type', 'application/json')
      let result = null
      try {
        /* check user folder exist or not */
        if (!fs.existsSync(`/home/pd2sudoku/${req.query.user}`)) shell.exec(`mkdir /home/pd2sudoku/${req.query.user}`)

        let projectID = await gitlabAPI.getProjectID(config.hostname, req.query.userID, config.projectName, req.query.token)
        result = await gitlabAPI.getArtifact(config.hostname, projectID, req.query.jobID, req.query.token, 'generate', `/home/pd2sudoku/${req.query.user}`, 'generate')
        result = await gitlabAPI.getArtifact(config.hostname, projectID, req.query.jobID, req.query.token, 'solve', `/home/pd2sudoku/${req.query.user}`, 'solve')
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
     * @param {string} req.query.user - gitlab username
     * @param {string} req.query.enemy - gitlab enemy username
     * @param {string} req.query.group - easy or hard
     * @inner
     * @param {string} path - express path
     * @param {callback} middleware - express middleware
     */
    router.get('/battle', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        /* if folder not exist, create one */
        if (!fs.existsSync('/home/pd2sudoku/battleFile')) shell.exec('mkdir /home/pd2sudoku/battleFile')
        let time = new Date().toISOString()
        /**
         * setting shell command
         *
         * 1. copy user and enemy file into 'battleFile' folder, prevent the file read more than once at the same time
         * 2. execute the battle-field battle engine beginning the battle
         */
        let shellCommand = `cp /home/pd2sudoku/${req.query.user} /home/pd2sudoku/battleFile/${req.query.user}_${time} -r && \
        cp /home/pd2sudoku/${req.query.enemy} /home/pd2sudoku/battleFile/${req.query.enemy}_${time} -r && \
        battle-field -m ${req.query.group} /home/pd2sudoku/battleFile/${req.query.user}_${time} /home/pd2sudoku/battleFile/${req.query.enemy}_${time}`

        exec.exec(shellCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] starting battle error\nerror message: ${error}\x1b[0m`)
            res.end(error)
          }
          let data = stdout.slice(0, stdout.length-1).split('\n')
          for (const item of data) {
            if (isJson(item)) {
                let result = JSON.parse(item)['winner']
                pd2sudokuELO.calculate(con, req.query.user, req.query.enemy, parseInt(result))
                res.end(JSON.stringify(data))
            }
          }
          console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] starting battle successful\x1b[0m`)
        })
      } catch (error) {
        console.error(`\x1b[31m${new Date().toISOString()} [platformBattleField operating error] starting battle error\nerror message: ${error}\x1b[0m`)
        res.status(500).end(error) // internal server error
      }
    })
    router.get('/record', async (req, res) => {
      res.set('Content-Type', 'application/json')
      try {
        let records = await gameDatabaseAPI.getRecord(con, req.query.page)
        console.log(`\x1b[32m${new Date().toISOString()} [platformBattleField operating] getting record successful\x1b[0m`)
        res.status(200).end(JSON.stringify(records))
      } catch (error) {
        console.log(`\x1b[31m${new Date().toISOString()} [platformBattleField operating] getting record failed\x1b[0m`)
        reject(error)
      }
    })
  }
}

function isJson(item) {
  item = typeof item !== "string" ? JSON.stringify(item) : item
  try {
    item = JSON.parse(item)
  } catch (error) {
    return false
  }

  if (typeof item === "object" && item !== null) {
    return true
  }
  return false
}


module.exports = { pd2sudokuBattleField }
