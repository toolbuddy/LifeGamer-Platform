import axios from 'axios'
const config = require('../../../../config/config')[process.env.NODE_ENV]
console.log(process.env.NODE_ENV)

export default {
  namespaced: true,
  state: {
    latestPipelineJobs: null,
    JobProcess: {},
    status: 'loading'
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
      state.status = 'done'
    },
    updatePipelineJob: function (state, payload) {
      state.JobProcess[payload.jobID].data = payload.data
      state.JobProcess[payload.jobID].complete = payload.complete
    }
  },
  actions: {
    /**
     * getting latest pipeline and its jobs
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - contains user id and token
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
