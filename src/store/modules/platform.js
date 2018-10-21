const axios = require('axios')
const config = require('../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    userdata: null,
    token: null
  },
  getters: {},
  mutations: {
    getCookieToken (state) {
      var v = document.cookie.match('(^|;) ?token=([^;]*)(;|$)')
      state.token = v ? v[2] : null
    },
    removeCookieToken (state) {
      document.cookie = 'token= ;path=/;expires=-1'
      state.token = null
    }
  },
  actions: {
    logout (context) {
      axios.get(`${config.hostname}/gitlab/users/sign_out`).then(() => {
        context.commit('removeCookieToken')
        window.location.reload()
      })
    }
  }
}
