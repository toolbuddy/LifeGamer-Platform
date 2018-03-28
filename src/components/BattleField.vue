<!-- HTML part -->
<template>
    <div class="battleField-wrapper">
      <section v-if='stage === "unregistered"'>
      </section>
      <section v-if='stage === "registered"'>
        <ul class="mode-select">
          <li class="mode">Attack select</li>
          <li class="mode">Defend select</li>
          <li class="mode">Battle</li>
        </ul>
      </section>
      <section v-if='stage === "battle"'>

      </section>
    </div>
</template>

<!-- js part -->
<script>
const config = require('../../config/config')

export default {
  name: 'battlefield',
  data: function () {
    return {
      token: null,
      userdata: null,
      register: null,
      pipelinejobs: null,
      stage: 'unregistered'
    }
  },
  created: function () {
    /* get user token from cookie */
    this.token = this.$cookies.get('token')
    /* get user data */
    this.$http
      .get(`${config.hostname}/gitlab/api/v4/user?access_token=${this.token}`)
      .then(response => {
        this.userdata = response.body
      })
      .then(() => {
        /* check user register or not */
        this.getUserRegisterStatus()
        this.getPipelineJobs()
      })
  },
  methods: {
    /* get user register or not */
    getUserRegisterStatus: function () {
      this.$http
        .get(
          `${config.hostname}/register_status?studentID=${
            this.userdata.username
          }`
        )
        .then(response => {
          this.register = response.body
        })
    },
    /* user register */
    userRegister: function () {
      this.$http
        .get(`${config.hostname}/register?studentID=${this.userdata.username}`)
        .then(response => {
          /* let user know register success or not */
          alert(`register ${response.body}`)
          /* reload page */
          location.reload()
        })
    },
    getPipelineJobs: function () {
      this.$http
        .get(
          `${config.hostname}/pipelinejobs?userID=${this.userdata.id}&token=${
            this.token
          }`
        )
        .then(response => {
          this.pipelinejobs = JSON.parse(response.bodyText)
        })
        .then(async () => {
          await this.stageSorting()
          /* set all pipeline score */
          this.pipelinejobs.forEach(pipeline => {
            this.getScore(pipeline)
          })
          console.log(this.pipelinejobs)
          this.stage = 'finish'
        })
    },
    stageSorting: function () {
      return new Promise(resolve => {
        /* pipeline jobs json format
         *
         * {
         *    'stage': [stage1, stage2, ...],
         *    'pipelineStatus': pipelineStatus,
         *    'stage1': [{'name': jobName, 'status': jobStatus }],
         *    'stage2': [{'name': jobName, 'status': jobStatus }],
         *     ...
         * }
         *
        */
        this.pipelinejobs.forEach(item => {
          let jobSort = {}
          /* set stages array */
          jobSort['stages'] = []
          /* set pipeline status */
          jobSort['pipelineStatus'] = item.jobs[0].pipeline.status
          item.jobs.forEach(job => {
            /* check json has key or not */
            if (jobSort.hasOwnProperty(job.stage)) {
              let jobData = {
                status: job.status,
                name: job.name
              }
              jobSort[job.stage].push(jobData)
            } else {
              jobSort['stages'].push(job.stage)
              jobSort[job.stage] = []
              let jobData = {
                status: job.status,
                name: job.name
              }
              jobSort[job.stage].push(jobData)
            }
          })
          item.jobs = jobSort
        })
        resolve('true')
      })
    },
    getScore: function (pipeline) {
      /* check pipeline status */
      if (
        pipeline.jobs.pipelineStatus === 'running' ||
        pipeline.jobs.pipelineStatus === 'pending'
      ) {
        pipeline['score'] = 'running'
        return
      }
      let score = 0
      pipeline.jobs.stages.forEach(stage => {
        pipeline.jobs[stage].forEach(job => {
          if (job.status === 'success') {
            score = score + config.stageScore[job.name]
          }
        })
      })
      pipeline['score'] = score
    }
  }
}
</script>

<!-- css part -->
<style scoped>
.battleField-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 50px 7%;
}

.mode-select {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.mode {
  text-align: center;
  float: left;
  margin: 15px;
  min-width: 120px;
  width: 30%;
  border-radius: 8px;
  border: 1px solid #666;
  padding: 5px 0;
  transition: all 0.3s ease;
}

.mode:hover {
  background-color: #666;
  color: #fff;
  cursor: pointer;
}
</style>
