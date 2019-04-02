const axios = require('axios')
const config = require('../../../../config/setting')

export default {
  namespaced: true,
  state: {
    group: null,
    memberList: null,
    enemy: null,
    process: false,
    battleResult: null
  },
  getters: {},
  mutations: {
    /**
     * updating user group
     *
     * @param {Object} state - vuex store state
     * @param {string} group - unregistered, basic, or advanced
     */
    updateGroup (state, group) { state.group = group },
    /**
     * updating member list
     *
     * @param {Object} state - vuex store state
     * @param {Object} memberList
     * - mode: battle, only with the memeber list that have same group
     * - mode: dashboard, member list with basic, advanced group
     */
    updateMemberList (state, memberList) { state.memberList = memberList },
    /**
     * updating enemy
     *
     * @param {Object} state - vuex store state
     * @param {string} enemy - enemy's gitlab username
     */
    updateEnemy (state, enemy) { state.enemy = enemy },
    /**
     * updating process status
     *
     * @param {Object} state - vuex store state
     * @param {Boolean} status
     */
    updateProcessStatus (state, status) { state.process = status },
    /**
     * updating battle result
     *
     * @param {Object} state - vuex store state
     * @param {Object} result - battle result
     */
    updateBattleResult (state, result) {
        let temp = [], battleResult = []
        for (let i = 0; i < result.length; ++i) {
            if (i !== result.length - 1) {
                temp.push(parseFloat(result[i]).toFixed(4))
                if (temp.length === 3) {
                    battleResult.push(temp)
                    temp = []
                }
            }
        }
        state.battleResult = battleResult
        console.log(state.battleResult)
    }
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
        context.commit('updateGroup', response.data)
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
      axios.get(`${config.hostname}/artifact?userID=${param.userID}&user=${param.user}&token=${param.token}&jobID=${param.job_id}`).then(() => {
        alert('update successful')
      })
    },
    /**
     * getting member list
     *
     * @param {Object} context - vuex store context
     * @param {string} group - easy, or hard, or both
     */
    getMemberList (context, group) {
      return new Promise(resolve => {
        axios.get(`${config.hostname}/memberList?group=${group}`).then((response) => {
          context.commit('updateMemberList', response.data)
          resolve()
        })
      })
    },
    /**
     * request for battle
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains user, enemy, and group
     */
    battleRequest (context, param) {
      context.commit('updateProcessStatus', true)
      context.commit('updateEnemy', param.enemy)
      axios.get(`${config.hostname}/battle?user=${param.user}&enemy=${param.enemy}&group=${param.group}`).then(response => {
        context.commit('updateBattleResult', response.data)
      })
    }
  }
}
