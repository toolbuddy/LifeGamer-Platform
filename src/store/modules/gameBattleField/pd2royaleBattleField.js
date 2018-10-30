const axios = require('axios')
const config = require('../../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    userStatus: 'unregistered',
    memberList: null,
    enemy: null
  },
  getters: {},
  mutations: {
    /**
     * Updating user status
     *
     * @param {Object} state - vuex store state
     * @param {string} status - user status: registered or unregistered
     */
    updateUserStatus (state, status) { state.userStatus = status },
    /**
     * Updating member list
     *
     * @param {Object} state - vuex store state
     * @param {Object} memberList - member list for battle
     */
    updateMemberList (state, memberList) { state.memberList = memberList },
    /**
     * Updating user current enemy
     *
     * @param {Object} state - vuex store state
     * @param {string} enemy - user current enemy
     */
    updateEnemy (state, enemy) { state.enemy = enemy }
  },
  actions: {
    /**
     * getting user register status from server database
     *
     * @param {Object} context - vuex store context
     * @param {string} username - user name
     */
    getUserStatus (context, username) {
      axios.get(`${config.hostname}/userRegisterStatus?user=${username}`).then(response => {
        console.log(response.data)
        context.commit('updateUserStatus', response.data)
      })
    },
    /**
     * register, setting user's status to 'registered' in server database
     *
     * @param {Object} context - vuex store context
     * @param {string} username - user name
     */
    userRegister (context, username) {
      axios.get(`${config.hostname}/register?user=${username}`).then(() => {
        location.reload()
      })
    },
    /**
     * getting member list from server database
     *
     * @param {Object} context - vuex store context
     */
    getMemberList (context) {
      axios.get(`${config.hostname}/memberList`).then(response => {
        context.commit('updateMemberList', response.data)
      })
    },
    /**
     * changing game code version
     * mode for changing attack code version or defend code version
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains mode, userID, username, token, and job_id
     */
    updateCodeVersion (context, param) {
      let mode = (param.status === 'unregistered') ? 'both' : param.mode
      axios.get(`${config.hostname}/artifact?userID=${param.userID}&user=${param.username}&token=${param.token}&jobID=${param.job_id}&mode=${mode}`).then(() => {
        alert('update successful')
      }).then(() => {
        if (param.status === 'unregistered') context.dispatch('userRegister', param.username)
      })
    },
    /**
     * battle request to server
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains user and enemy
     */
    battleRequest (context, param) {
      context.commit('updateEnemy', param.enemy)
      axios.get(`${config.hostname}/battle?user=${param.user}&enemy=${param.enemy}`).then(() => { context.commit('updateEnemy', param.enemy) })
    }
  }
}
