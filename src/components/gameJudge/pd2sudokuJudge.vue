<template>
  <section class='pd2sudokuJudging' v-if='JobStatus === "done"'>
    <div v-for="(stage, index) in latestPipelineJobs.stages" :key="index">
      <h3> {{ stage }} </h3>
      <div class="processWrapper">
        <div v-for="(job, index) in latestPipelineJobs[stage]" :key="index">
          <h4> {{ job.name }} </h4>
          <pre><code :id="'job-' + job.id"></code></pre>
        </div>
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
    ...mapState('judge', ['JobProcess', 'latestPipelineJobs', 'JobStatus'])
  },
  methods: {
    ...mapActions('judge', ['getJudgingProcess']),
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
  watch: {
    JobStatus (newValue, oldValue) {
      if (newValue === 'done') this.pollingInterval()
    }
  },
  beforeDestroy () {
    var keys = Object.keys(this.IntervalPool)
    for (let key of keys) {
      clearInterval(this.IntervalPool[key])
    }
  }
}
</script>

<style scoped>
code {
  color: #fff;
}
</style>
