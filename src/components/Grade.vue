<!-- HTML part -->
<template>
    <section class="section-wrapper">
      <div v-if='this.stage === "finish"'>
        <!-- The template here showing all pipelines status -->
        <!-- start -->
        <div class="pipelines-row pipelines-header-row">
          <div class="pipelines-item pipelines-commit-id">Commit SHA</div>
          <div class="pipelines-item pipelines-time">Time</div>
          <div class="pipelines-item pipelines-score">Score</div>
          <div class="pipelines-item pipelines-button">Best: {{ bestScore }}</div>
        </div>
        <div v-for="(pipeline,index) in pipelinejobs" :key="index">
          <div class="pipelines-row">
            <div class="pipelines-item pipelines-commit-id" v-html="convertCommitSHA(pipeline.id)"></div>
            <div class="pipelines-item pipelines-time" v-html="formatDate(new Date(pipeline.time))"></div>
            <div class="pipelines-item pipelines-score"> {{ pipeline.score }} </div>
            <div class="pipelines-item pipelines-button click-button" @click="detailToggle(index)">Detail</div>
          </div>
          <!-- end -->
          <!-- The template here showing jobs detail inside a pipeline -->
          <!-- start -->
          <div class="pipelines-details details-off" :id="dynamicID(index)">
            <!-- unordered list show all stage -->
            <ul style="list-style: none;" v-for="(stage, index) in pipeline.jobs.stages" :key="index">
              <span class="stageStyle">{{ stage }}</span>
              <!-- list show all jobs in stage -->
              <li style="padding: 10px;" v-for="(job, index) in pipeline.jobs[stage]" :key="index">
                <span class="jobStyle" :style="jobColor(job)">{{ job.name }}</span>
              </li>
            </ul>
          </div>
          <!-- end -->
        </div>
      </div>
    </section>
</template>

<!-- js part -->
<script>
const config = require('../../config/config')

export default {
  name: 'grade',
  data: function () {
    return {
      token: null,
      userdata: null,
      pipelinejobs: null,
      commitTable: null,
      bestScore: 0,
      dbScore: null,
      stage: 'waiting'
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
      /* deal with db data */
      .then(() => {
        /* get score from db in server */
        this.$http
          .get(
            `${config.hostname}/user_grade?studentID=${this.userdata.username}`
          )
          .then(response => {
            this.dbScore = response.body
            this.bestScore = response.body
          })
          .then(() => {
            this.getPipelineJobs()
            this.getCommitTable()
          })
      })
  },
  watch: {
    bestScore: function () {
      if (this.bestScore > this.dbScore) {
        this.dbScore = this.bestScore
        this.$http.post(
          `${config.hostname}/user_grade`,
          {
            studentID: this.userdata.username,
            score: this.bestScore
          },
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  },
  methods: {
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
        .then(() => {
          this.addPipelineTime()
        })
        .then(async () => {
          await this.stageSorting()
          /* set all pipeline score */
          this.pipelinejobs.forEach(pipeline => {
            this.getScore(pipeline)
          })
          /* set max score */
          this.setMaxscore()
          this.stage = 'finish'
        })
    },
    getCommitTable: function () {
      this.$http
        .get(`${config.hostname}/commitTable?user=${this.userdata.username}`)
        .then(response => {
          this.commitTable = JSON.parse(response.bodyText)
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
    },
    /* show job span color according to its status */
    jobColor: function (job) {
      return job.status === 'success'
        ? { color: 'green' }
        : job.status === 'failed' ? { color: 'red' } : { color: 'blue' }
    },
    /* add created time to pipeline */
    addPipelineTime: function () {
      this.pipelinejobs.forEach(pipeline => {
        pipeline['time'] = pipeline.jobs[0].created_at
      })
    },
    /* convert pipeline ID to commit SHA */
    convertCommitSHA: function (pipelineID) {
      let commitSHA = null
      this.commitTable.forEach(item => {
        if (item.pipelineID === pipelineID) {
          commitSHA = item.sha
        }
      })
      return commitSHA
    },
    dynamicID: function (index) {
      return `pipeline-detail-${index}`
    },
    formatDate: function (date) {
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var ampm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      hours = hours || 12 // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes
      var strTime = hours + ':' + minutes + ' ' + ampm
      return (
        date.getMonth() +
        1 +
        '/' +
        date.getDate() +
        '/' +
        date.getFullYear() +
        '  ' +
        strTime
      )
    },
    /* open/off the details info */
    detailToggle: function (index) {
      let detail = document.querySelector(`div[id='pipeline-detail-${index}']`)
      if (detail.classList.contains('details-off')) {
        detail.classList.remove('details-off')
        detail.classList.add('details-on')
      } else {
        detail.classList.remove('details-on')
        detail.classList.add('details-off')
      }
    },
    /* get max score */
    setMaxscore: function () {
      this.pipelinejobs.forEach(pipeline => {
        if (pipeline.score !== 'running') {
          this.bestScore = Math.max(this.bestScore, pipeline.score)
        }
      })
    }
  }
}
</script>

<!-- css part -->
<style scoped>
.section-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 90px 7%;
}

.pipelines-row {
  width: 100%;
  height: 70px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #8c8c8c;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.pipelines-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.pipelines-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.pipelines-time {
  width: 25%;
}

.pipelines-commit-id {
  width: 25%;
}

.pipelines-score {
  width: 25%;
}

.pipelines-button {
  width: 25%;
}

.click-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #006d70;
  transition: all 0.3s ease;
}

.click-button:hover {
  background-color: #009688;
  cursor: pointer;
  color: #fff;
}

.pipelines-details {
  transition: all 0.3s ease;
}

.details-off {
  display: none;
  opacity: 0;
}

.details-on {
  display: block;
  opacity: 1;
}

.stageStyle {
  font-size: 25px;
  font-weight: bold;
  padding-left: 15px;
}

.jobStyle {
  padding-left: 50px;
}
</style>
