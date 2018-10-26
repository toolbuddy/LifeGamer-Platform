const config = require('../../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    ws: null,
    level1: null,
    level2: null,
    level3: null,
    level4: null
  },
  getters: {
    JudgeProcess: function (state, level) { return state[level] }
  },
  mutations: {
    /**
     * assign websocket
     *
     * @param {Object} state - vuex store state
     * @param {Object} ws - websocket object
     */
    assignWebSocket: function (state, ws) { state.ws = ws },
    updateJudgeProcess: function (state, param) { state[param.level] = param.data }
  },
  actions: {
    createWebSocket: function (context, param) {
      var wss = new WebSocket(`${config.hostname}/ws`)
      wss.onopen = function () { wss.send(JSON.stringify({method: 'register', token: param.token})) }
      wss.onclose = function () { wss.send(JSON.stringify({method: 'unregister', token: param.token})) }
      wss.onmessage = function (evt) {
        context.commit('updateJudgeProcess', JSON.parse(evt.data))
      }
      context.commit('assignWebSocket', wss)
    }
  }
}
