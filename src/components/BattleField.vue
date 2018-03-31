<!-- HTML part -->
<template>
    <div class="battleField-wrapper">
      <section v-if='this.stage === "registered" && this.loaded === true'>
        <ul class="mode-select">
          <li id="defend" class="mode select" @click="selectMode('defend')">Defend select</li>
          <li id="attack" class="mode" @click="selectMode('attack')">Attack select</li>
          <li id="battle" class="mode" @click="selectMode('battle')">Battle</li>
        </ul>
      </section>
      <section v-if='this.select === "battle" && this.battleList !== null'>
        <div class="battle-list-row battle-list-header-row">
          <div class="battle-list-item battle-list-player">Player</div>
          <div class="battle-list-item battle-list-elo">ELO</div>
          <div class="battle-list-item battle-list-button"></div>
        </div>
        <div class="battle-list-row" v-for="(item, index) in battleList" :key="index">
          <div class="battle-list-item battle-list-player">{{ item.studentID }}</div>
          <div class="battle-list-item battle-list-elo"> {{ item.elo }} </div>
          <div class="battle-list-item battle-list-button click-button" v-if='item.studentID !== userdata.username'>Battle</div>
        </div>
      </section>
      <section v-if='this.stage === "unregistered" && this.loaded === true'>
        <article>
          <h2>You have not registered yet, please select one pipeline to register</h2>
          <p>The pipeline you select will become your defend and attack code, but you can change them after you register.</p>
        </article>
      </section>
      <section v-if='this.stage === "registered" || this.stage === "unregistered"'>
        <section v-if='this.select !== "battle"'>
          <div v-if='this.loaded === true' class="pipelines-row pipelines-header-row">
            <div class="pipelines-item pipelines-commit-id">Commit SHA</div>
            <div class="pipelines-item pipelines-time">Time</div>
            <div class="pipelines-item pipelines-score">Score</div>
            <div class="pipelines-item pipelines-button"></div>
          </div>
          <div v-for="(pipeline,index) in pipelinejobs" :key="index" v-if="pipeline.score >= 25">
            <div class="pipelines-row">
              <div class="pipelines-item pipelines-commit-id"><a :href="pipelineURL(pipeline.id)" v-html="convertCommitSHA(pipeline.id)"></a></div>
              <div class="pipelines-item pipelines-time" v-html="formatDate(new Date(pipeline.time))"></div>
              <div class="pipelines-item pipelines-score"> {{ pipeline.score }} </div>
              <div class="pipelines-item pipelines-button click-button" @click="selectPipeline(pipeline)">Select</div>
            </div>
          </div>
        </section>
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
      pipelinejobs: null,
      commitTable: null,
      stage: null,
      select: 'defend',
      loaded: false,
      battleList: null
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
        this.getCommitTable()
      })
  },
  watch: {
    select: function () {
      /* remove class 'select' from all mode select item */
      Array.from(document.querySelectorAll('li.mode')).forEach(item => {
        item.classList.remove('select')
      })
      document.querySelector(`li#${this.select}`).classList.add('select')
    }
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
          this.stage = response.body
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
    getCommitTable: function () {
      this.$http
        .get(`${config.hostname}/commitTable?user=${this.userdata.username}`)
        .then(response => {
          this.commitTable = JSON.parse(response.bodyText)
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
          await this.setPipelineParam()
          /* set all pipeline score */
          this.pipelinejobs.forEach(pipeline => {
            this.getScore(pipeline)
          })
          this.loaded = true
        })
    },
    setPipelineParam: function () {
      return new Promise(resolve => {
        this.pipelinejobs.forEach(pipeline => {
          /* set pipeline time */
          pipeline['time'] = pipeline.jobs[0].created_at
          /* set artifact job id */
          pipeline['artifact_id'] = pipeline.jobs[0].id
        })
        resolve('true')
      })
    },
    /* pipeline url */
    pipelineURL: function (id) {
      return `${config.hostname}/gitlab/${this.userdata.username}/${
        config.projectName
      }/pipelines/${id}`
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
      pipeline.jobs.forEach(job => {
        if (job.status === 'success') {
          score = score + config.stageScore[job.name]
        }
      })
      pipeline['score'] = score
    },
    selectPipeline: function (pipeline) {
      let filename = null
      if (this.stage === 'unregistered') filename = 'both'
      else filename = this.select
      console.log(filename)
      /* send request to server, asking for getting artifact file */
      this.$http
        .get(
          `${config.hostname}/artifact?studentID=${
            this.userdata.username
          }&userID=${this.userdata.id}&token=${this.token}&jobID=${
            pipeline.artifact_id
          }&filename=${filename}`
        )
        .then(response => {
          alert(`select ${response.body}`)
        })
      /* register if not register yet */
      if (this.stage === 'unregistered') {
        this.userRegister()
      }
    },
    selectMode: function (mode) {
      this.select = mode
      if (mode === 'battle') this.getBattleList()
    },
    /* get battle enemy list */
    getBattleList: function () {
      this.$http.get(`${config.hostname}/battle_list`).then(response => {
        this.battleList = response.body
        console.log(this.battleList)
      })
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

.select {
  background-color: #666;
  color: #fff;
}

.pipelines-row,
.battle-list-row {
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

.pipelines-header-row,
.battle-list-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.pipelines-item,
.battle-list-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.pipelines-time,
.pipelines-commit-id,
.pipelines-score,
.pipelines-button {
  width: 25%;
}

.battle-list-rank,
.battle-list-player,
.battle-list-elo,
.battle-list-button {
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
