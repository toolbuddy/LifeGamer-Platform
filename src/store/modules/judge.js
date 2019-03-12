const axios = require('axios')
const config = require('../../../config/config')[process.env.NODE_ENV]

/* Date format */
Date.prototype.pattern = function (fmt) {
  fmt = new Date((fmt - fmt.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace(/[A-Z]/g, ' ')
  return fmt
}

export default {
  namespaced: true,
  state: {
    curBranch: 'master',
    branchList: null,
    commits: null,
    page: 1,
    status: 'loading',
    latestPipelineJobs: null,
    JobProcess: {},
    JobStatus: 'loading'
  },
  getters: {
    commitsLen: function (state) { return (state.commits) ? state.commits.length : 0 }
  },
  mutations: {
    assignLatestPipeline: function (state, latestPipelineJobs) {
      state.latestPipelineJobs = latestPipelineJobs
      state.JobProcess = {}
      for (let stage of state.latestPipelineJobs.stages) {
        for (let job of state.latestPipelineJobs[stage]) {
          state.JobProcess[job.id] = { 'stage': stage, 'job': job.name, 'data': '...', 'complete': false }
        }
      }
      state.JobStatus = 'done'
    },
    updatePipelineJob: function (state, payload) {
      state.JobProcess[payload.jobID].data = payload.data
      state.JobProcess[payload.jobID].complete = payload.complete
    },
    /**
     * updating commit list, also change time format inside the commit.commited_date
     *
     * @param {Object} state - vuex store state
     * @param {Object} commits - commit list(20 records max)
     */
    updateCommits (state, commits) {
      state.commits = commits
      state.commits.forEach(commit => {
        let datetime = new Date(commit.committed_date)
        commit.committed_date = datetime.pattern(datetime)
      })
    },
    /**
     * Updating current select branch
     *
     * @param {Object} state - vuex store state
     * @param {String} branch - branch name
     */
    updateBranch (state, branch) { state.curBranch = branch },
    /**
     * Updating current select page
     *
     * @param {Object} state - vuex store state
     * @param {number} page - cur page
     */
    updatePage (state, page) { state.page = page },
    /**
     * Updating branch list
     *
     * @param {Object} state - vuex store state
     * @param {Object} branchList - branch list, array
     */
    updateBranchList (state, branchList) { state.branchList = branchList },
    /**
     * Updating judge page status
     *
     * @param {Object} state - vuex store state
     * @param {string} status - current status, loading, done, judging
     */
    updateStatus (state, status) { state.status = status },
  },
  actions: {
    /**
     * getting commits according to branch and page, 20 records per page
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains userID, branch, page, and token
     */
    getCommits (context, param) {
      axios.get(`${config.hostname}/commits?userID=${param.userID}&branch=${param.branch}&page=${param.page}&token=${param.token}`).then(response => {
        context.commit('updateCommits', response.data)
        context.commit('updateStatus', 'done')
      }).catch(error => {
        console.log(error.response)
        context.commit('updateStatus', 'error')
      })
    },
    /**
     * getting branch list
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains userID, token
     */
    getBranchList (context, param) {
      axios.get(`${config.hostname}/branchList?userID=${param.userID}&token=${param.token}`).then(response => {
        context.commit('updateBranchList', response.data)
      }).catch(error => {
        console.log(error.response)
        context.commit('updateBranchList', 'error') // cannot get branchlist, user have no repo
      })
    },
    /**
     * Sending judge request
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains userID, username, sha, branch, and token
     */
    judgeRequest (context, param) {
      axios.get(`${config.hostname}/judge?userID=${param.userID}&username=${param.username}&sha=${param.sha}&branch=${param.branch}&token=${param.token}`).then(response => {
        context.dispatch('getLatestPipelineJobs', {
          userID: param.userID,
          token: param.token
        })
      }).catch(error => {
        alert('Sorry, your project is now judging, please wait for finishing judging then try again')
      })
    },
    /**
     * getting latest pipeline and its jobs
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains user id, and token
     */
    getLatestPipelineJobs: function (context, param) {
      return new Promise(resolve => {
        axios.get(`${config.hostname}/latestPipelineJobs?userID=${param.userID}&token=${param.token}`).then(response => {
          context.commit('assignLatestPipeline', response.data)
        }).then(() => { resolve() })
      })
    },
    /**
     * getting job judging process from certain job
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains username and job ID
     */
    getJudgingProcess: function (context, param) {
      return new Promise(resolve => {
        axios.get(`${config.hostname}/gitlab/${param.username}/${config.projectName}/-/jobs/${param.jobID}/trace.json`).then(response => {
          context.commit('updatePipelineJob', {
            'jobID': param.jobID,
            'data': (response.data.status !== 'skipped') ? response.data.html : 'skipped...',
            'complete': response.data.complete
          })
          resolve()
        }).catch(error => {
          context.commit('updatePipelineJob', {
            'jobID': param.jobID,
            'data': 'failed....',
            'complete': true
          })
          resolve()
        })
      })
    }
  }
}
