<!-- HTML part -->
<template>
    <div>
        <h1>Resource</h1>
    </div>
</template>

<!-- js part -->
<script>
const config = require('../../config/config')

export default {
  name: 'Resource',
  data: function () {
    return {
      markdownString: '',
      is_admin: false,
      edit: false
    }
  },
  created: function () {
    /* check is admin or not */
    this.checkAdmin()
    /* get query string */
    this.edit = this.$router.currentRoute.query.edit
  },
  methods: {
    checkAdmin: function () {
      let cookie = this.$cookies.get('token')
      this.$http
        .get(`${config.hostname}/gitlab/api/v4/user?access_token=${cookie}`)
        .then(response => {
          this.is_admin = response.body.is_admin
        })
    }
  }
}
</script>

<!-- css part -->
<style scope>

</style>
