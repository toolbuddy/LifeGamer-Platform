const axios = require('axios')
const config = require('../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    grade: null,
    pipelines: null,
    page: 1,
    status: 'loading'
  },
  getters: {
    /**
     * getting pipelines array length
     *
     * @param {Object} state - vuex store state
     */
    pipelinesLen (state) { return state.pipelines.length }
  },
  mutations: {
    /**
     * Update page number
     *
     * @param {Object} state - vuex store state
     * @param {number} page - page number
     */
    updatePage (state, page) { state.page = page },
    /**
     * Update grade
     *
     * @param {Object} state - vuex store state
     * @param {number} grade - user grade getting from backend server database
     */
    updateGrade (state, grade) { state.grade = grade },
    /**
     * Update pipelines (at most 10 records according to page)
     *
     * @param {Object} state - vuex store state
     * @param {Object} pipelines - pipelines done sorting
     */
    updatePipelines (state, pipelines) { state.pipelines = pipelines },
    /**
     * Update status
     *
     * @param {Object} state - vuex store state
     * @param {string} status - grade page status, loading or done
     */
    updateStatus (state, status) { state.status = status }
  },
  actions: {
    /**
     * getting user's grade from backend database
     *
     * @param {Object} context - vuex store context
     * @param {string} username - user name
     */
    getGrade (context, username) {
      axios.get(`${config.hostname}/grade?user=${username}`).then(response => { context.commit('updateGrade', response.data) })
    },
    /**
     * getting pipelines from backend server and sort it as the format needed
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains userID, page, token
     */
    getPipelines (context, param) {
      axios.get(`${config.hostname}/pipelinejobs?userID=${param.userID}&page=${param.page}&token=${param.token}`).then(async response => {
        context.commit('updatePipelines', response.data)
        context.commit('updateStatus', 'done')
      }).catch(error => {
        console.log(error.response)
        context.commit('updateStatus', 'error')
      })
    }
  }
}
