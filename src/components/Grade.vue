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
      userdata: null
    }
  },
  created: async function () {
    /* get token from cookie */
    this.token = await this.getToken()
    /* get user data via gitlab api */
    this.$http
      .get(`${config.hostname}/gitlab/api/v4/user?access_token=${this.token}`)
      .then(response => {
        this.userdata = response.body
      })
    /* send request to server, asking server to update user pipelines history */
    // this.askUpdate();
  },
  methods: {
    getToken: function () {
      return new Promise((resolve, reject) => {
        resolve(this.$cookies.get('token'))
      })
    },
    askUpdate: function () {
      return new Promise((resolve, reject) => {
        this.$http
          .get(`${config.hostname}/db_history?token=${this.token}`)
          .then(response => {
            resolve(response.body)
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
  padding: 10px 10%;
}
</style>
