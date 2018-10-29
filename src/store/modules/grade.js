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
        let pipelines = []
        for (let pipeline of response.data) {
          let _pipeline = await context.dispatch('pipelineSort', pipeline)
          _pipeline = await context.dispatch('calculateScore', _pipeline)
          pipelines.push(_pipeline)
        }
        context.commit('updatePipelines', pipelines)
      }).then(() => {
        context.commit('updateStatus', 'done')
      })
    },
    /**
     * pipeline sorting
     *
     * pipeline format
     * {
     *    id: id,
     *    stages: [stage1, stage2, ...],
     *    time: time,
     *    status: status,
     *    score: score,
     *    stage1: [{ name: name, status: status }, {...}],
     *    stage2: [{ name: name, status: status }, {...}],
     *    ...
     * }
     *
     * @param {Object} context - vuex store context
     * @param {Object} pipeline - pipeline getting from server
     * @return {Promise<Object>} - a promise contains pipeline done sorting
     * @resolve {Object} - pipeline done sorting
     */
    pipelineSort (context, pipeline) {
      return new Promise(async (resolve, reject) => {
        let datetime = new Date(pipeline[0].created_at)
        let _pipeline = {
          id: pipeline[0].pipeline.id,
          time: datetime.pattern(datetime),
          status: pipeline[0].status,
          stages: [],
          score: 0
        }
        for (let job of pipeline) {
          _pipeline = await context.dispatch('jobSort', { job: job, pipeline: _pipeline })
        }
        resolve(_pipeline)
      })
    },
    /**
     * job data sorting
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains pipeline, job
     * @return {Promise<Object>} a promise contains pipeline partly done sorting
     * @resolve {Object} pipeline partly done sorting
     */
    jobSort (context, param) {
      return new Promise((resolve, reject) => {
        let pipeline = param.pipeline
        if (pipeline.hasOwnProperty(param.job.stage)) {
          pipeline[param.job.stage].push({ name: param.job.name, status: param.job.status })
        } else {
          pipeline.stages.push(param.job.stage)
          pipeline[param.job.stage] = ([{ name: param.job.name, status: param.job.status }])
        }
        resolve(pipeline)
      })
    },
    /**
     * calculate pipeline grade
     *
     * @param {Object} context - vuex store context
     * @param {Object} pipeline - pipeline not add score yet
     * @return {Promise<Object>} a promise contains pipeline that score added
     * @resolve {Object} pipeline that score added
     */
    calculateScore (context, pipeline) {
      return new Promise(async (resolve, reject) => {
        let _pipeline = pipeline
        if (_pipeline.status === 'running' || _pipeline.status === 'pending') {
          _pipeline.score = 'running'
        } else {
          for (let stage of _pipeline.stages) {
            _pipeline.score += await context.dispatch('getStageScore', { stage: stage, pipeline: _pipeline })
          }
        }
        resolve(_pipeline)
      })
    },
    /**
     * getting all score in one certain stage
     *
     * @param {Object} context - vuex store context
     * @param {Object} param - param, contains stage, pipeline
     * @return {Promise<number>} a promise contains stage score
     * @resolve {number} stage score
     */
    getStageScore (context, param) {
      return new Promise(async (resolve, reject) => {
        let score = 0
        for (let job of param.pipeline[param.stage]) {
          score += await context.dispatch('getJobScore', job)
        }
        resolve(score)
      })
    },
    /**
     * getting one job score
     *
     * @param {Object} context - vuex store context
     * @param {Object} job - contains name and status
     * @return {Promise<number>} a promise contains job score
     * @resolve {number} job score
     */
    getJobScore (context, job) {
      return new Promise((resolve, reject) => {
        let score = (job.status === 'success') ? config.stageScore[job.name] : 0
        resolve(score)
      })
    }
  }
}
