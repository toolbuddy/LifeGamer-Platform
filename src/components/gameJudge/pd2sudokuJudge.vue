<template>
  <section class='pd2sudokuJudging' v-if='status === "done"'>
    <div v-for="(stage, index) in latestPipelineJobs.stages" :key="index">
      <h3> {{ stage }} </h3>
      <div class="processWrapper">
        <pre v-for="(job, index) in latestPipelineJobs[stage]" :key="index"><code :id="'job-' + job.id"></code></pre>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'pd2sudokuJudge',
  data: function () {
    return {
      IntervalPool: {}
    }
  },
  computed: {
    ...mapState('platform', ['userdata', 'token']),
    ...mapState('gameJudge', ['JobProcess', 'latestPipelineJobs', 'status'])
  },
  methods: {
    ...mapActions('gameJudge', ['getLatestPipelineJobs', 'getJudgingProcess']),
    pollingInterval () {
      for (let stage of this.latestPipelineJobs.stages) {
        for (let job of this.latestPipelineJobs[stage]) {
          this.IntervalPool[job.id] = setInterval(async () => {
            if (this.JobProcess[job.id].complete && this.IntervalPool[job.id]) clearInterval(this.IntervalPool[job.id])
            await this.getJudgingProcess({ username: this.userdata.username, jobID: job.id })
            document.querySelector(`code#job-${job.id}`).innerHTML = this.JobProcess[job.id].data
          }, 3000)
        }
      }
    }
  },
  created: async function () {
    await this.getLatestPipelineJobs({
      userID: this.userdata.id,
      token: this.token
    })
    this.pollingInterval()
    // window.location.href = 'https://pd2a.imslab.org/#/grade'
  }
}
</script>

<style scoped>
code {
  color: #fff;
}
</style>
