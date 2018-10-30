<!-- HTML part -->
<template>
    <div class="battleField-wrapper">
      <!-- unregistered part, show message let user to register -->
      <!-- begin -->
      <section v-if='userStatus === "unregistered" && status === "done"'>
        <article>
          <h2>You have not registered yet, please select one pipeline to register</h2>
          <p>The pipeline you select will become your defend and attack code, but you can change them after you register.</p>
        </article>
      </section>
      <!-- end -->

      <!-- registered part, show mode select button -->
      <!-- begin -->
      <section v-if='userStatus === "registered" && status === "done"'>
        <ul class="mode-select">
          <li id="defend" :class="[this.mode === 'defend' ? 'mode select' : 'mode']" @click="selectMode('defend')">Defend select</li>
          <li id="attack" :class="[this.mode === 'attack' ? 'mode select' : 'mode']" @click="selectMode('attack')">Attack select</li>
          <li id="battle" :class="[this.mode === 'battle' ? 'mode select' : 'mode']" @click="selectMode('battle')">Battle</li>
          <li id="replay" :class="[this.mode === 'replay' ? 'mode select' : 'mode']" @click="selectMode('replay')">Replay</li>
        </ul>
      </section>
      <!-- end -->

      <!-- attack/defend mode -->
      <!-- begin -->
      <section v-if='userStatus === "registered" || userStatus === "unregistered"'>
        <section v-if='this.mode === "defend" || this.mode === "attack"'>
          <div v-if='status === "done"'>
            <div class="pipelines-row pipelines-header-row">
              <div class="pipelines-item pipelines-time">Time</div>
              <div class="pipelines-item pipelines-link">Link</div>
              <div class="pipelines-item pipelines-button"></div>
            </div>
            <div v-for="(pipeline,index) in pipelines" :key="index" v-if="pipeline.score >= 25">
              <div class="pipelines-row">
                <div class="pipelines-item pipelines-time" v-html="pipeline.time"></div>
                <div class="pipelines-item pipelines-link"><a :href="pipelineURL(pipeline.id)">Link</a></div>
                <div class="pipelines-item pipelines-button click-button" @click="selectPipeline(pipeline)">Select</div>
              </div>
            </div>
            <div class="page-select">
              <ul class="pageinaction">
                <li v-if="page > 1" @click="selectPage(page-1)">Prev</li>
                <li v-if="pipelinesLen == 10" @click="selectPage(page+1)">Next</li>
              </ul>
            </div>
          </div>
          <Loading v-else></Loading>
        </section>
      </section>
      <!-- end -->

      <!-- battle mode -->
      <!-- begin -->
      <section v-if='this.mode === "battle" && memberList !== null'>
        <section v-if='enemy === "none" || enemy === null'>
          <div class="battle-list-row battle-list-header-row">
            <div class="battle-list-item battle-list-player">Player</div>
            <div class="battle-list-item battle-list-elo">ELO</div>
            <div class="battle-list-item battle-list-button"></div>
          </div>
          <div class="battle-list-row" v-for="(member, index) in memberList" :key="index">
            <div class="battle-list-item battle-list-player">{{ member.username }}</div>
            <div class="battle-list-item battle-list-elo"> {{ member.elo }} </div>
            <div class="battle-list-item battle-list-button click-button" v-if='member.username !== userdata.username' @click="battleRequest({user: userdata.username, enemy: member.username})">Battle</div>
          </div>
        </section>
        <section v-else>
          <iframe :src='`${hostname}:3001/game_start?p1=${userdata.username}&p2=${enemy}`'></iframe>
        </section>
      </section>
      <!-- end -->

      <!-- battle mode -->
      <!-- begin -->
      <section v-if='this.mode === "replay"'>
        <iframe :src='`${this.hostname}:3001/replay_list`'></iframe>
      </section>
      <!-- end -->
    </div>
</template>

<!-- js part -->
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Loading from '@/components/Loading'

export default {
  name: 'pd2royaleBattleField',
  components: { Loading },
  data: function () {
    return { mode: 'defend' }
  },
  computed: {
    ...mapState('platform', ['userdata', 'token', 'hostname', 'projectName']),
    ...mapState('grade', ['status', 'pipelines', 'page']),
    ...mapState('gameBattleField', ['userStatus', 'memberList', 'enemy']),
    ...mapGetters('grade', ['pipelinesLen'])
  },
  created: function () {
    this.getPipelines({ userID: this.userdata.id, page: this.page, token: this.token })
    this.getUserStatus(this.userdata.username)
  },
  methods: {
    ...mapMutations('grade', ['updatePage', 'updateStatus']),
    ...mapActions('gameBattleField', ['getMemberList', 'updateCodeVersion', 'battleRequest', 'getUserStatus']),
    ...mapActions('grade', ['getPipelines']),
    /* pipeline url */
    pipelineURL: function (id) {
      return `${this.hostname}/gitlab/${this.userdata.username}/${
        this.projectName
      }/pipelines/${id}`
    },
    selectPipeline: function (pipeline) {
      this.updateCodeVersion({ status: this.userStatus, username: this.userdata.username, mode: this.mode, userID: this.userdata.id, job_id: pipeline.artifact_id, token: this.token })
    },
    selectMode: function (mode) {
      this.mode = mode
      if (mode === 'battle') this.getMemberList()
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
.battleField-wrapper {
  box-sizing: border-box;
  padding: 50px 7%;
}

.mode-select {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mode {
  text-align: center;
  float: left;
  margin: 5px;
  width: 250px;
  border-radius: 8px;
  border: 1px solid #666;
  padding: 5px 0;
  transition: all 0.3s ease;
}

.mode:hover {
  background-color: #666;
  color: #fff;
  cursor: pointer;
}

.select {
  background-color: #666;
  color: #fff;
}

.pipelines-row, .battle-list-row {
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

.pipelines-header-row, .battle-list-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.pipelines-item, .battle-list-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.pipelines-time, .pipelines-link, .pipelines-button { width: calc(100% /3); }
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

.battle-list-rank, .battle-list-player, .battle-list-elo, .battle-list-button { width: 25%; }
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

iframe {
  border: 0;
  width: 100%;
  height: 500px;
}
</style>
