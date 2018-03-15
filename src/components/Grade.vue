<!-- HTML part -->
<template>
    <section class="section-wrapper">
      <div v-if='this.stage === "finish"'>
        <div class="pipelines-row pipelines-header-row">
          <div class="pipelines-item pipelines-id">Pipeline ID</div>
          <div class="pipelines-item pipelines-commit-id">Commit SHA</div>
          <div class="pipelines-item pipelines-score">Score</div>
          <div class="pipelines-item pipelines-button"></div>
        </div>
        <div class="pipelines-row" v-for="(pipeline,index) in pipelinejobs" :key="index">
          <div class="pipelines-item pipelines-id">{{ pipeline.id }}</div>
          <div class="pipelines-item pipelines-commit-id"></div>
          <div class="pipelines-item pipelines-score" v-html="totalScore(pipeline.jobs)"></div>
          <div class="pipelines-item pipelines-button click-button">Detail</div>
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
      .then(() => {
        this.getPipelineJobs()
      })
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
          this.stage = 'finish'
        })
    },
    totalScore: function (jobs) {
      let score = 0
      jobs.forEach(job => {
        if (job.status === 'success') {
          score = score + config.stageScore[job.name]
        }
      })
      return score
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

.pipelines-id {
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
</style>
