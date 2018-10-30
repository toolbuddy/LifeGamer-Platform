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
    status: 'loading'
  },
  getters: {
    commitsLen: function (state) { return (state.commits) ? state.commits.length : 0 }
  },
  mutations: {
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
    updateStatus (state, status) { state.status = status }
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
      }).then(() => {
        context.commit('updateStatus', 'done')
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
      })
    },
    /**
     * Sending judge request
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains userID, username, sha, branch, and token
     */
    judgeRequest (context, param) {
      axios.get(`${config.hostname}/judge?userID=${param.userID}&username=${param.username}&sha=${param.sha}&branch=${param.branch}&token=${param.token}`)
    }
  }
}
