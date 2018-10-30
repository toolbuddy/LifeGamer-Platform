<!-- HTML part -->
<template>
  <section class="section-wrapper">
    <div v-if='status === "done"'>
      <!-- The template here showing all pipelines status -->
      <!-- start -->
      <div class="pipelines-row pipelines-header-row">
        <div class="pipelines-item pipelines-time">Time</div>
        <div class="pipelines-item pipelines-score">Score</div>
        <div class="pipelines-item pipelines-button">Best: {{ grade }}</div>
        <div class="pipelines-item pipelines-link">Link</div>
      </div>
      <div v-for="(pipeline,index) in pipelines" :key="index">
        <div class="pipelines-row">
          <div class="pipelines-item pipelines-time"> {{ pipeline.time }} </div>
          <div class="pipelines-item pipelines-score"> {{ pipeline.score }} </div>
          <div class="pipelines-item pipelines-button click-button" @click="detailToggle(index)">Detail</div>
          <div class="pipelines-item pipelines-link"><a :href="`${hostname}/gitlab/${userdata.username}/${projectName}/pipelines/${pipeline.id}`">Link</a></div>
        </div>
        <!-- end -->
        <!-- The template here showing jobs detail inside a pipeline -->
        <!-- start -->
        <div class="pipelines-details details-off" :id="`pipeline-detail-${index}`">
          <!-- unordered list show all stage -->
          <ul style="list-style: none;" v-for="(stage, index) in pipeline.stages" :key="index">
            <span class="stage-style">{{ stage }}</span>
              <!-- list show all jobs in stage -->
            <li style="padding: 10px;" v-for="(job, index) in pipeline[stage]" :key="index">
              <span class="job-style" :style="jobColor(job)">{{ job.name }}</span>
            </li>
          </ul>
        </div>
        <!-- end -->
      </div>
      <div class="page-select">
        <ul class="pageinaction">
          <li v-if="page > 1" @click="selectPage(page-1)">Prev</li>
          <li v-if="pipelinesLen == 10" @click="selectPage(page+1)">Next</li>
        </ul>
      </div>
    </div>
    <!-- waiting data -->
    <Loading v-else></Loading>
  </section>
</template>

<!-- js part -->
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import Loading from '@/components/Loading'

export default {
  name: 'grade',
  components: { Loading },
  computed: {
    ...mapState('platform', ['hostname', 'projectName', 'userdata', 'token']),
    ...mapState('grade', ['page', 'pipelines', 'status', 'grade']),
    ...mapGetters('grade', ['pipelinesLen'])
  },
  created: function () {
    this.getServerStatus()
    this.getPipelines({ userID: this.userdata.id, page: this.page, token: this.token })
    this.getGrade(this.userdata.username)
  },
  methods: {
    ...mapActions('grade', ['getCommitTable', 'getGrade', 'getPipelines']),
    ...mapActions('platform', ['getServerStatus']),
    ...mapMutations('grade', ['updateStatus', 'updatePage']),
    /* show job span color according to its status */
    jobColor: function (job) {
      return job.status === 'success' ? { color: 'green' } : job.status === 'failed' ? { color: 'red' } : { color: 'blue' }
    },
    /* open/off the details info */
    detailToggle: function (index) {
      let detail = document.querySelector(`div[id='pipeline-detail-${index}']`)
      if (detail.classList.contains('details-off')) {
        detail.classList.remove('details-off')
        detail.classList.add('details-on')
      } else {
        detail.classList.remove('details-on')
        detail.classList.add('details-off')
      }
    },
    selectPage (page) {
      this.updateStatus('loading')
      this.updatePage(page)
      this.getPipelines({ userID: this.userdata.id, page: page, token: this.token })
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
  padding: 90px 7%;
}

.pipelines-row {
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

.pipelines-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.pipelines-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.pipelines-time { width: 25%; }
.pipelines-link { width: 25%; }
.pipelines-score { width: 25%; }
.pipelines-button { width: 25%; }

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

.pipelines-details {
  transition: all 0.3s ease;
}

.details-off {
  display: none;
  opacity: 0;
}

.details-on {
  display: block;
  opacity: 1;
}

.stage-style {
  font-size: 25px;
  font-weight: bold;
  padding-left: 15px;
}

.job-style {
  padding-left: 50px;
}

.page-select {
  text-align: center;
  border-top: 1px solid #8c8c8c;
}

.pageinaction {
  display: inline-block;
  padding: 0;
  margin-top: 2.2rem;
}

.pageinaction > li {
  display: inline;
  border: 1px solid #bcbcbc;
  border-radius: 5px;
  padding: 7px 20px;
}

.pageinaction > li:hover {
  cursor: pointer;
  background-color:#777;
  color: #fff;
}
</style>
