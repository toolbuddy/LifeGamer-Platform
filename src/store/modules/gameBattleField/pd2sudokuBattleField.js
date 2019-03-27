const axios = require('axios')
const config = require('../../../../config/setting')

export default {
  namespaced: true,
  state: {
    group: null,
    process: false
  },
  getters: {},
  mutations: {
    /**
     * updating user group
     *
     * @param {Object} state - vuex store state
     * @param {string} group - unregistered, easy, or hard
     */
    updateGroup (state, group) { state.group = group }
  },
  actions: {
    /**
     * getting user's group
     *
     * @param {Object} context - vuex store context
     * @param {string} username - user's gitlab username
     */
    getUserGroup (context, username) {
      axios.get(`${config.hostname}/userGroup?user=${username}`).then(response => {
        context.commit('updateGroup', response)
      })
    },
    /**
     * updating user's group
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains user and group
     */
    updateUserGroup (context, param) {
      axios.get(`${config.hostname}/updateGroup?user=${param.user}&group=${param.group}`).then(() => { location.reload() })
    },
    /**
     * updating user's judge code version
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains userID, username, token, and job id
     */
    updateCodeVersion (context, param) {
      axios.get(`${config.hostname}/artifact?userID=${param.userID}&user=${param.username}&token=${param.token}&jobID=${param.job_id}`).then(() => {
        alert('update successful')
      })
    },
    /**
     * request for battle
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains user, enemy, and group
     */
    battleRequest (context, param) {
      axios.get(`${config.hostname}/battle?user=${param.user}&enemy=${param.enemy}&group=${param.group}`).then((response => {
        if (response !== 'done') {
          /**
           * TODO: the process response handler
           */
        }
      }))
    }
  }
}
