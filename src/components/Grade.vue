<!-- HTML part -->
<template>
    <section class="section-wrapper">
        <h1>Grade</h1>
        <div class="commit-list">
          <div class="commit-row" v-if="loaded" v-for="item in commits['dev']" :key="item.id">
            <div class="commit-item commit-shortid">{{ item.short_id }}</div>
            <div class="commit-item commit-title"> {{ item.title }} </div>
            <div class="commit-item commit-time">{{ item.committed_date }}</div>
            <div class="commit-item commit-button"></div>
          </div>
        </div>
    </section>
</template>

<!-- js part -->
<script>
const config = require('../../config/config')

/* Date format */
Date.prototype.pattern = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // dat
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
  name: 'grade',
  data: function () {
    return {
      token: null,
      userdata: null,
      branch: null,
      commits: null,
      loaded: false
    }
  },
  created: function () {
    /* get token from cookie */
    this.token = this.$cookies.get('token')
    /* get user data via gitlab api */
    this.$http
      .get(`${config.hostname}/gitlab/api/v4/user?access_token=${this.token}`)
      .then(response => {
        this.userdata = response.body
      })
      .then(function () {
        /* send request to server, asking server to update user pipelines history */
        this.getCommits()
      })
  },
  methods: {
    getCommits: function () {
      this.$http
        .get(
          `${config.hostname}/commits?userID=${this.userdata.id}&token=${
            this.token
          }`
        )
        .then(response => {
          this.commits = JSON.parse(response.bodyText)
          this.branch = Object.keys(this.commits)
          this.loaded = true
        })
        .then(() => {
          this.branch.forEach(list => {
            this.commits[list].forEach(item => {
              let datetime = new Date(item.committed_date)
              item.committed_date = datetime.pattern('yyyy-MM-dd hh:mm:ss')
            })
          })
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
  padding: 50px 10%;
}

.commit-list {
  width: 100%;
  background-color: #f9f9f9;
}
.commit-row {
  width: 100%;
  height: 70px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #8c8c8c;
  border-bottom: 1px solid #8c8c8c;
  box-sizing: border-box;
}

.commit-item {
  float: left;
  margin: 0 10px;
  height: 100%;
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
</style>
