<!-- HTML part -->
<template>
    <section class="section-wrapper">
        <h1>Grade</h1>
        <div class="commit-list">
          <div class="commit-row">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
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
      commits: null
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
          this.commits = response.bodyText
          console.log('commits: ' + this.commits)
          console.log(JSON.parse(this.commits))
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
  height: 60px;
  line-height: 20px;
  border-top: 1px solid #8c8c8c;
  border-bottom: 1px solid #8c8c8c;
  box-sizing: border-box;
}
</style>
