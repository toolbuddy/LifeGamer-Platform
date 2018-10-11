<!-- HTML part -->
<template>
    <section class="section-wrapper">
      <div class="waiting-page" v-if='this.stage === "waiting"'>
        <div class="waiting-box"></div>
        <div>please wait...</div>
      </div>
      <div v-if='this.stage === "commitSelect"'>
        <div class="branch-selector">
          <div class="current-branch"> {{ this.curBranch }} </div>
            <ul class="branch-select">
              <li class="select-item" v-for="(item, index) in branch" :key="index" @click="branchSelect(item)"> {{ item }} </li>
              </ul>
          </div>
        <div class="commit-row commit-header-row">
          <div class="commit-item commit-shortid">Short ID</div>
          <div class="commit-item commit-title">Title</div>
          <div class="commit-item commit-time">Commit Time</div>
          <div class="commit-item commit-button"></div>
        </div>
        <div class="commit-row" v-for="item in commits[this.curBranch]" :key="item.id">
          <div class="commit-item commit-shortid"><a :href="commitURL(item.id)">{{ item.short_id }}</a></div>
          <div class="commit-item commit-title"> {{ item.title }} </div>
          <div class="commit-item commit-time">{{ item.committed_date }}</div>
          <div class="commit-item commit-button click-button" @click="commitChoose(item.short_id)">select</div>
        </div>
      </div>
      <div class="gameRendering" v-if='this.stage === "commitSelected"'>
        <div><h4>Level 1:</h4><pre id="level-1" class="gameProcess">pending.....</pre></div>
        <div><h4>Level 2:</h4><pre id="level-2" class="gameProcess">pending.....</pre></div>
        <div><h4>Level 3:</h4><pre id="level-3" class="gameProcess">pending.....</pre></div>
        <div><h4>Level 4:</h4><pre id="level-4" class="gameProcess">pending.....</pre></div>
      </div>
    </section>
</template>

<!-- js part -->
<script>
const config = require('../../config/config')[process.env.NODE_ENV]

/* Date format */
Date.prototype.pattern = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // date
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // hour
    'H+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // season
    S: this.getMilliseconds() // millisecond
  }
  var week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468'
        : '') + week[this.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export default {
  name: 'commit',
  data: function () {
    return {
      token: null,
      userdata: null,
      branch: null,
      curBranch: null,
      commits: null,
      loaded: false,
      serverStatus: 'on',
      is_admin: true,
      socket: null,
      stage: 'waiting'
    }
  },
  watch: {
    is_admin: function () {
      if (!this.is_admin && this.serverStatus === 'off') {
        window.location.href = config.hostname
      }
    }
  },
  created: function () {
    /* get token from cookie */
    this.token = this.$cookies.get('token')
    this.$http.get(`${config.hostname}/db_serverStatus`).then(response => {
      this.serverStatus = response.body
    })
    /* get user data via gitlab api */
    this.$http
      .get(`${config.hostname}/gitlab/api/v4/user?access_token=${this.token}`)
      .then(response => {
        this.userdata = response.body
        this.is_admin = response.body.is_admin
      })
      .then(function () {
        /* send request to server, asking server to update user pipelines history */
        this.getCommits()
      })
  },
  beforeDestroy: function () {
    if (this.socket !== null) {
      console.log('disconnect~')
      this.socket.disconnect()
    }
  },
  methods: {
    getCommits: function () {
      this.$http
        .get(
          `${config.hostname}/commits?userID=${this.userdata.id}&branch=master&page=1&token=${
            this.token
          }`
        )
        .then(response => {
          /* get response, changing commit page stage */
          this.commits = JSON.parse(response.bodyText)
          this.branch = Object.keys(this.commits)
          this.stage = 'commitSelect'
          this.loaded = true
          this.curBranch = this.branch[0]
        })
        .then(() => {
          /* change date time format */
          this.branch.forEach(list => {
            this.commits[list].forEach(item => {
              let datetime = new Date(item.committed_date)
              item.committed_date = datetime.pattern('yyyy-MM-dd hh:mm:ss')
            })
          })
        })
    },
    commitChoose: function (shortID) {
      this.socket = new WebSocket('wws://hmkrl.com/ws')
      /* connection */
      this.socket.on('connect', () => {
        console.log('[%s]on connect', this.socket.id)
      })
      let timestamp = Date.parse(new Date()).toString()
      let Ttoken = this.token + timestamp
      /* send data to server to save in table */
      this.socket.emit('client commit', {
        token: this.token,
        Ttoken: Ttoken,
        user: this.userdata.username,
        userID: this.userdata.id,
        branch: this.curBranch,
        sha: shortID
      })
      this.stage = 'commitSelected'
      /* set receive function */
      this.socket.on('level 1', function (data) {
        document.querySelector('pre[id="level-1"]').innerHTML = data
      })
      this.socket.on('level 2', function (data) {
        document.querySelector('pre[id="level-2"]').innerHTML = data
      })
      this.socket.on('level 3', function (data) {
        document.querySelector('pre[id="level-3"]').innerHTML = data
      })
      this.socket.on('level 4', function (data) {
        document.querySelector('pre[id="level-4"]').innerHTML = data
      })
    },
    branchSelect: function (branch) {
      this.curBranch = branch
    },
    commitURL: function (id) {
      return `${config.hostname}/gitlab/${this.userdata.username}/${
        config.projectName
      }/commit/${id}`
    }
  }
}
</script>

<!-- css part -->
<style scoped>
.section-wrapper {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 50px 7%;
}

.commit-row {
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

.commit-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.commit-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.commit-title {
  width: 50%;
}

.commit-time {
  width: 20%;
}

.commit-shortid {
  width: 15%;
}

.commit-button {
  width: 15%;
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

.commit-button:hover {
  background-color: #009688;
  cursor: pointer;
  color: #fff;
}

.branch-selector {
  width: 100%;
}

.branch-select {
  float: right;
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.current-branch {
  float: left;
  padding: 12px;
  margin: 10px 0;
  border-left: 5px solid #bcbcbc;
}

.select-item {
  float: right;
  margin: 2px 5px;
  background-color: #fff;
  color: #000;
  padding: 10px;
  border-radius: 10px;
  width: 80px;
  border: 1px solid #bcbcbc;
  text-align: center;
  transition: all 0.3s ease;
}

.select-item:hover {
  background-color: #777;
  color: #fff;
  cursor: pointer;
}

@media screen and (min-width: 1200px) {
  .commit-title {
    display: block;
  }
}

@media screen and (max-width: 1200px) {
  .commit-title {
    display: none;
  }
  .commit-time {
    width: 50%;
  }
  .commit-shortid {
    width: 25%;
  }
  .commit-button {
    width: 25%;
  }
}

.gameRendering {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.gameProcess {
  width: 450px;
  height: 450px;
  color: #fff;
  margin: 0;
}

/* for waiting content */
.waiting-page {
  display: flex;
  width: 100%;
  height: 450px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.waiting-page > div {
  margin: 15px;
}

.waiting-box {
  width: 80px;
  height: 80px;
  background-color: red;
  animation: 1s animate-inifite infinite;
}

@keyframes animate-inifite {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
