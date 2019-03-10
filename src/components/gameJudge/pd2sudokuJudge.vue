<template>
  <section class='pd2sudokuJudging'>

  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'pd2sudokuJudge',
  methods: {
    ...mapActions('gameJudge', ['getJudgingProcess'])
  },
  created: function () {
    /*this.getJudgingProcess({
      'jobID': 248,
      'username': 'justlaxative'
    })*/
    window.location.href = 'https://pd2a.imslab.org/#/grade'
  }
}
</script>

<style scoped>
</style>
