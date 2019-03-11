const request = require('request')
const fs = require('fs')
const shell = require('shelljs')

var gitlabAPI = {
  /**
   * getting user data
   *
   * @param {string} host - server host
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Object>} the promise contains userdata
   * @resolve {Object} userdata, the data from gitlab
   * @reject {error} RequestError
   */
  getUserData (host, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/user?access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting user data error: \nreuqest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting user data successful\x1b[0m`)
          resolve(JSON.parse(body))
        }
      })
    })
  },
  /**
   * getting project ID
   *
   * @param {string} host - server host
   * @param {number} userID - user ID
   * @param {string} projectName - the project name wonna to search for its ID
   * @param {string} token - user's gitlab access token
   * @returns {Promise<number>} the promise contains project ID
   * @resolve {number} project ID
   * @reject {error} RequestError
   */
  getProjectID (host, userID, projectName, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        host
      }/gitlab/api/v4/users/${userID}/projects?search=${projectName}&access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting projectID error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          if (JSON.parse(body).length !== 0) {
            console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting projectID successful\x1b[0m`)
            resolve(JSON.parse(body)[0].id)
          } else {
            console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting projectID error:\nrequest url: ${url}\x1b[0m`)
            reject('User have no certain repo')
          }
        }
      })
    })
  },
  /**
   * getting pipelines
   * It'll get 10 records per page, user can choose which page wonna to see.
   * It'll get all branches' records, but showing belongs to which branch inside frontend details
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {number} page - page number, 10 pipelines per page.
   * @param {string} token - user’s gitlab access token
   * @returns {Promise<Object>} the promise contains pipelines(json format)
   * @resolve {Object} pipelines list(json format)
   * @reject {error} RequestError
   */
  getPipelines (host, projectID, page, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/pipelines?per_page=10&page=${page}&access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting pipelines error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          if (JSON.parse(body).length !== 0) {
            console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting pipelines successful\x1b[0m`)
            resolve(JSON.parse(body))
          } else {
            console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting pipelines error: \nrequest url: ${url}\nerror message: User have no pipeline\x1b[0m`)
            reject('User have no pipeline')
          }
        };
      })
    })
  },
  /**
   * getting latest pipeline
   *
   * @param {string} host - gitlab server host
   * @param {number} projectID - project ID
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Object>} the promise contains latest pipeline
   * @resolve {Object} latest pipeline
   * @reject {error} RequestError
   */
  getLatestPipeline (host, projectID, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/pipelines?per_page=1&page=1&access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting pipelines error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          if (JSON.parse(body).length !== 0) {
            console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting pipelines successful\x1b[0m`)
            resolve(JSON.parse(body))
          } else {
            console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting pipelines error: \nrequest url: ${url}\nerror message: User have no pipeline\x1b[0m`)
            resolve('User have no pipeline')
          }
        };
      })
    })
  },
  /**
   * getting all certain pipeline jobs
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {number} pipelineID - pipeline ID
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Object>} the promise contains job list of the certain pipeline
   * @resolve {Object} job list
   * @reject {error} RequestError
   */
  getPipelineJobs (host, projectID, pipelineID, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/pipelines/${pipelineID}/jobs?access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting pipeline jobs error: \nrequest url: ${url}\nerror message; ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting pipeline jobs successful\x1b[0m`)
          resolve(JSON.parse(body))
        }
      })
    })
  },
  /**
   * getting list of one project's branches
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Obkect>} the promise contains branch list
   * @resolve {Object} branch list
   * @reject {error} RequestError
   */
  getBranchList (host, projectID, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/repository/branches?access_token=${token}`
      let branchList = [] // we only need branch name, but gitlab api response many info we needn't.
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting branchlist error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting branchList successful\x1b[0m`)
          Array.from(JSON.parse(body)).forEach(branchItem => { branchList.push(branchItem.name) })
          resolve(branchList)
        }
      })
    })
  },
  /**
   * getting certain branch's commits in one repository
   * getting 20 records per page, user needs to choose page to get data.
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {string} branch - branch name
   * @param {number} page - page number, 20 commits per page.
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Object>} the promise contains commit list
   * @resolve {Object} commit list
   * @reject {error} RequestError
   */
  getCommits (host, projectID, branch, page, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/repository/commits?access_token=${token}&ref_name=${branch}&page=${page}&per_page=20`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting commits data error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting commits data successful\x1b[0m`)
          resolve(JSON.parse(body))
        }
      })
    })
  },
  /**
   * post pipeline, creating new pipeline doing judgment
   * But it'll select the 'latest' commit to create pipeline jobs
   * So if wonna choose certain version, it needs to put changing version's commands into gitlabCI script.
   * before posting pipeline, it also needs give commit sha let CI know which version to checkout.
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {string} branch - branch name
   * @param {string} token - user's gitlab access token
   * @returns {Promise<Object>} the promise contains HTTP response
   * @resolve {Object} HTTP response
   * @reject {error} RequestError
   */
  postPipeline (host, projectID, branch, token) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/pipeline?ref=${branch}&access_token=${token}`
      request.post(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] posting new pipeline error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] posting new pipeline successful\x1b[0m`)
          resolve(rsp)
        }
      })
    })
  },
  /**
   * getting Artifact file
   *
   * @param {string} host - server host
   * @param {number} projectID - project ID
   * @param {number} jobID - job ID, the artifact file is binding to job
   * @param {string} token - user's gitlab access token
   * @param {string} target - the file wonna download inside the artifact
   * @param {string} path - file path
   * @param {string} filename - file name
   * @returns {Promise<Object>} the promise contains HTTP response
   * @resolve {Object} - HTTP response
   * @reject {error} RequestError
   */
  getArtifact (host, projectID, jobID, token, target, path, filename) {
    return new Promise((resolve, reject) => {
      let url = `${host}/gitlab/api/v4/projects/${projectID}/jobs/${jobID}/artifacts/${target}?access_token=${token}`
      request.get(url, (error, rsp, body) => {
        if (error) {
          console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] getting Artifact file error: \nrequest url: ${url}\nerror message: ${error}\x1b[0m`)
          reject(error)
        } else {
          /* if folder not exist, create one */
          if (!fs.existsSync(path)) shell.exec(`mkdir ${path}`)
          /* make HTTP response as a file */
          fs.writeFile(`${path}/${filename}`, body, (err) => {
            if (err) {
              console.error(`\x1b[31m${new Date().toISOString()} [gitlabAPI operating error] writing executable file error: \nerror message: ${err}\x1b[0m`)
            } else {
              shell.exec(`chmod 777 ${path}/${filename}`)
              console.log(`\x1b[32m${new Date().toISOString()} [gitlabAPI operating] getting artifact file successful\x1b[0m`)
              resolve(rsp)
            }
          })
        }
      })
    })
  }
}

module.exports = { gitlabAPI }
