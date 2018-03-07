<!-- HTML part -->
<template>
    <section class="section-wrapper">
        <h1>Grade</h1>
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
        console.log('userdata: ' + this.userdata)
      })
      .then(function () {
        /* send request to server, asking server to update user pipelines history */
        this.commits = this.getCommits()
        console.log(this.commits)
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
          return response.body
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
  padding: 10px 10%;
}
</style>
