import axios from 'axios'
const config = require('../../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    processing: 'true',
  },
  mutations: {
  },
  actions: {
    getJudgingProcess: function (context, param) {
      axios.get(`${config.hostname}/gitlab/${param.username}/${config.projectName}/-/jobs/${param.jobID}/trace.json`).then(response => {
        console.log(response.data)
      })
    }
  }
}
