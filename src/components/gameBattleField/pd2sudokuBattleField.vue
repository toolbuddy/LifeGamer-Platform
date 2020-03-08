<template>
  <div class="battleField-wrapper">
    <Loading v-if='status === "loading"'></Loading>
    <!-- The part user not registered yet -->
    <!-- begin -->
    <section v-if='group === "unregistered" && status === "done"' class="unregistered">
        <span class="title">Please choose group</span>
        <div class="group-button" @click="selectGroup('basic')">
            <img src="../../assets/basic.svg" />
            <span>Basic</span>
        </div>
        <div class="group-button" @click="selectGroup('advanced')">
            <img src="../../assets/advanced.svg" />
            <span>Advanced</span>
        </div>
    </section>
    <!-- end -->

    <!-- The part user have already registered -->
    <!-- headbar mode select part -->
    <!-- begin -->
    <section v-if='(group === "basic" || group === "advanced") && status === "done"'>
        <ul class="mode-select">
            <li class="mode" @click="selectMode('selectCode')">Code select</li>
            <li class="mode" @click="selectMode('battle')">Battle</li>
            <li class="mode" @click="selectMode('dashboard')">Dashboard</li>
            <li class="mode" @click="selectMode('record')">Record</li>
        </ul>
    </section>
    <!-- end -->

    <section v-if='group === "updating"' style="padding: 20px 0;">
        <h2>please select one pipeline to register</h2>
        <p>Select one code version, and you can change them after you register.</p>
    </section>

    <section v-if='(group === "basic" || group === "advanced" || group === "updating") && status === "done"'>
        <!-- The part code version select -->
        <!-- start -->
        <section v-if='this.mode === "selectCode"'>
            <div class="pipelines-row pipelines-header-row">
                <div class="pipelines-item pipelines-time">Time</div>
                <div class="pipelines-item pipelines-grade">Grade</div>
                <div class="pipelines-item pipelines-link">Link</div>
                <div class="pipelines-item pipelines-button"></div>
            </div>
            <div v-for="(pipeline, index) in pipelines" :key="index">
                <div class="pipelines-row">
                    <div class="pipelines-item pipelines-time" v-html="pipeline.time"></div>
                    <div class="pipelines-item pipelines-grade" v-html="pipeline.score"></div>
                    <div class="pipelines-item pipelines-link"><a :href="pipelineURL(pipeline.id)">Link</a></div>
                    <div class="pipelines-item pipelines-button" v-if='allowPipeline(pipeline)'>
                        <div class="click-button" @click="selectPipeline(pipeline)">Select</div>
                    </div>
                </div>
            </div>
            <div class="page-select">
                <ul class="pageinaction">
                    <li v-if="page > 1" @click="selectPage(page-1)">Prev</li>
                    <li v-if="pipelinesLen == 10" @click="selectPage(page+1)">Next</li>
                </ul>
            </div>
        </section>
        <!-- end -->

        <!-- The battle part -->
        <!-- start -->
        <section class="battleboard" v-if='this.mode === "battle"'>
            <section>
                <div class="battleboard-headerbar">
                    <div class="battleboard-item"><strong>Rank</strong></div>
                    <div class="battleboard-item"><strong>Gitlab ID</strong></div>
                    <div class="battleboard-item"><strong>ELO</strong></div>
                    <div class="battleboard-item"><strong>Group: {{ group }} </strong></div>
                </div>
                <div class="battleboard-contain" v-for="(member, index) in memberList" :key="index">
                    <div class="battleboard-item"> {{ index + 1 }}</div>
                    <div class="battleboard-item"> {{ member.gitlabID }} </div>
                    <div class="battleboard-item"> {{ member.ELO }} </div>
                    <div class="battleboard-item" v-if='member.gitlabID !== userdata.username'>
                        <div class="click-button" @click="battleRequest({ user: userdata.username, enemy: member.gitlabID, group: group })">Battle</div>
                    </div>
                </div>
            </section>
            <section class="battle-result" v-if='process'>
                <div class="battle-result-wrapper">
                    <div class="battle-result-header">Result</div>
                    <div v-for='(result, index) in battleResult' :key="index">
                        <section class="battle-result-row" v-if='result.length === 3'>
                            <div>Round {{ index + 1 }} </div>
                            <div>{{ userdata.username }} v.s. {{ enemy }} </div>
                            <div>{{ result[0] }} : {{ result[1] }}</div>
                            <div v-html='roundResult(result[2])' :style="roundColor(result[2])"></div>
                        </section>
                    </div>
                    <div class="battle-result-row">
                        <div class="battle-result-backButton" @click="backFunction()">Back</div>
                    </div>
                </div>
            </section>
        </section>
        <!-- end -->

        <!-- The dashboard part -->
        <!-- start -->
        <section class="dashboard" v-if='this.mode === "dashboard"'>
            <div class="dashboard-easy">
                <div class="dashboard-easy-headerbar"><strong>Basic</strong></div>
                <div class="dashboard-contain">
                    <div class="dashboard-contain-item">Rank</div>
                    <div class="dashboard-contain-item">Gitlab ID</div>
                    <div class="dashboard-contain-item">ELO (change)</div>
                </div>
                <div class="dashboard-contain" v-for='(member, index) in memberList["basic"]' :key="index">
                    <div class="dashboard-contain-item"> {{ index+1 }} </div>
                    <div class="dashboard-contain-item"> {{ member.gitlabID }} </div>
                    <div class="dashboard-contain-item">
                        <span>{{ member.ELO }}</span>
                        <span :style="ELOcolor(member)">( {{ member.ELO - member.pre_ELO }} )</span>
                    </div>
                </div>
            </div>
            <div class="dashboard-hard">
                <div class="dashboard-hard-headerbar"><strong>Advanced</strong></div>
                <div class="dashboard-contain">
                    <div class="dashboard-contain-item">Rank</div>
                    <div class="dashboard-contain-item">Gitlab ID</div>
                    <div class="dashboard-contain-item">ELO (change)</div>
                </div>
                <div class="dashboard-contain" v-for='(member, index) in memberList["advanced"]' :key="index">
                    <div class="dashboard-contain-item"> {{ index+1 }} </div>
                    <div class="dashboard-contain-item"> {{ member.gitlabID }} </div>
                    <div class="dashboard-contain-item">
                        <span>{{ member.ELO }}</span>
                        <span :style="ELOcolor(member)">( {{ member.ELO - member.pre_ELO }} )</span>
                    </div>
                </div>
            </div>
        </section>
        <!-- end -->

        <!-- The record part -->
        <!-- start -->
        <section v-if='this.mode === "record"'>
            <div class="record-row record-header-row">
                <div class="record-item">Time</div>
                <div class="record-item">Player1</div>
                <div class="record-item">Player2</div>
                <div class="record-item">Winner</div>
                <div class="record-item">P1Change</div>
                <div class="record-item">P2Change</div>
            </div>
            <div v-for="(record, index) in records" :key="index">
                <div class="record-row">
                    <div class="record-item">{{ record.time }}</div>
                    <div class="record-item">{{ record.player1 }}</div>
                    <div class="record-item">{{ record.player2 }}</div>
                    <div class="record-item">{{ record.winner }}</div>
                    <div class="record-item">{{ record.p1change }}</div>
                    <div class="record-item">{{ record.p2change }}</div>
                </div>
            </div>
            <div class="page-select">
                <ul class="pageinaction">
                    <li v-if="recordPage > 1" @click="selectRecordPage(recordPage-1)">Prev</li>
                    <li v-if="records.length === 15" @click="selectRecordPage(recordPage+1)">Next</li>
                </ul>
            </div>
        </section>
        <!-- end -->
    </section>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Loading from '@/components/Loading'

export default {
  name: 'pd2sudokuBattleField',
  components: { Loading },
  data: function () {
    return {
      mode: 'selectCode',
      temp: null
    }
  },
  computed: {
    ...mapState('platform', ['userdata', 'token', 'hostname', 'projectName']),
    ...mapState('grade', ['status', 'pipelines', 'page']),
    ...mapState('gameBattleField', ['group', 'enemy', 'memberList', 'process', 'battleResult', 'records', 'recordPage']),
    ...mapGetters('grade', ['pipelinesLen'])
  },
  created: function () {
    this.getPipelines({ userID: this.userdata.id, page: this.page, token: this.token })
    this.getUserGroup(this.userdata.username)
  },
  methods: {
    ...mapMutations('grade', ['updatePage', 'updateStatus']),
    ...mapMutations('gameBattleField', ['updateGroup', 'updateProcessStatus', 'updateRecordPage']),
    ...mapActions('platform', ['getServerStatus']),
    ...mapActions('gameBattleField', ['getUserGroup', 'updateUserGroup', 'updateCodeVersion', 'battleRequest', 'getMemberList', 'getRecord']),
    ...mapActions('grade', ['getPipelines']),
    pipelineURL: function (id) {
      return `${this.hostname}/gitlab/${this.userdata.username}/${this.projectName}/pipelines/${id}`
    },
    selectGroup: function (group) {
      this.updateGroup('updating')
      this.temp = group
      // this.updateUserGroup({ user: this.userdata.username, group: group })
    },
    selectMode: async function (mode) {
      this.mode = mode
      if (mode === 'battle') {
        this.updateStatus('loading')
        await this.getMemberList(this.group)
        this.updateStatus('done')
      } else if (mode === 'dashboard') {
        this.updateStatus('loading')
        await this.getMemberList('both')
        this.updateStatus('done')
      } else if (mode === 'record') {
        this.getRecord(this.page)
      }
    },
    selectPage: function (page) {
      this.updateStatus('loading')
      this.updatePage(page)
      this.getPipelines({ userID: this.userdata.id, page: page, token: this.token })
    },
    allowPipeline: function (pipeline) {
      return pipeline.Generate[0].status === 'success' && pipeline.Stability[0].status === 'success'
    },
    selectPipeline: function (pipeline) {
      this.updateCodeVersion({
        user: this.userdata.username,
        userID: this.userdata.id,
        token: this.token,
        job_id: pipeline.artifact_id
      })
      if (this.temp !== null) {
        this.updateUserGroup({ user: this.userdata.username, group: this.temp })
      }
    },
    ELOcolor: function (member) {
      return (member.ELO - member.pre_ELO >= 0) ? ((member.ELO - member.pre_ELO > 0) ? { color: 'green' } : { color: 'black' }) : { color: 'red' }
    },
    roundResult: function (result) {
      return (result) ? ((result > 1) ? 'Lose' : 'Win') : 'Tie'
    },
    roundColor: function (result) {
      return (result) ? ((result > 1) ? { color: 'red' } : { color: 'green' }) : { color: 'white' }
    },
    backFunction: function () {
      this.updateProcessStatus(false)
      this.selectMode('battle')
      this.getServerStatus()
    },
    selectRecordPage: async function (page) {
      this.updateStatus('loading')
      this.updateRecordPage(page)
      await this.getRecord(this.recordPage)
      this.updateStatus('done')
    }
  }
}
</script>
<style scoped>
.battleField-wrapper {
    margin-top: 50px;
    padding: 0 5%;
}

.unregistered {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    height: calc(100vh - 100px);
}

.title {
    width: 100%;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    margin-top: 20px;
}
.group-button {
    width: 25%;
    min-width: 250px;
    border: 1px solid #bcbcbc;
    border-radius: 5%;
    background-color: #e9e9e9;
    text-align: center;
    padding: 10px;
    margin: 5%;
    opacity: 0.5;
    transition: all .3s ease;
}

.group-button > img { margin: 10px 0; }
.group-button:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.1);
}

.mode-select {
    list-style: none;
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.mode {
    text-align: center;
    float: left;
    border: 1px solid #d9d9d9;
    background-color: #efefef;
    padding: 5px;
    width: 20%;
    min-width: 180px;
    margin: 10px 0;
}

.mode:hover {
    box-shadow: 1px 1px 1px #EAEAEA;
    transform: scale(1.05);
    cursor: pointer;
}

.pipelines-row, .battleboard-contain, .battleboard-headerbar, .record-row {
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

.pipelines-header-row, .battleboard-headerbar, .record-header-row {
    background-color: steelblue;
    color: #fff;
    height: 35px;
}

.pipelines-item, .battle-list-item, .record-item {
    float: left;
    text-align: center;
}

.pipelines-time, .pipelines-grade, .pipelines-link, .pipelines-button { width: 25%; }
.pipelines-button { height: 60%; }
.page-select {
    text-align: center;
    border-top: 1px solid #8c8c8c;
}

.pageinaction {
    display: inline-block;
    padding: 0;
    margin: 2.2rem 0;
}

.pageinaction > li {
    display: inline;
    border: 1px solid #bcbcbc;
    border-radius: 3px;
    padding: 7px 20px;
}

.pageinaction > li:hover {
    cursor: pointer;
    background-color: #777;
    color: #fff;
}

.click-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5%;
    margin: 0 15%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #006d70;
    transition: all .3s ease;
}

.click-button:hover {
    background-color: #009688;
    cursor: pointer;
    color: #fff;
}

.dashboard {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dashboard-easy, .dashboard-hard {
    width: 50%;
    min-width: 150px;
    height: 35px;
    color: white;
    line-height: 35px;
    margin: 0 20px;
    text-align: center;
}

.dashboard-easy-headerbar { background-color: #006EFF; }
.dashboard-hard-headerbar { background-color: #D7234B; }
.dashboard-contain {
    background-color: #efefef;
    border-top: 1px solid #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dashboard-contain-item {
    width: 30%;
    padding: 0 15px;
    color: #000;
}

.battleboard-item {
    width: 25%;
    height: 35px;
    line-height: 35px;
    text-align: center;
}

.battle-result {
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, .75);
    color: #fff;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    padding: 7.5% 10%;
}

.battle-result-wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 5%;
    border: 10px solid #fff;
    text-align: center;
}

.battle-result-header {
    font-size: 36px;
    font-weight: bold;
    border-bottom: 2px solid #fff;
    padding: 15px 0;
}

.battle-result-row {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 15px 0;
    flex-wrap: wrap;
    font-weight: bold;
    text-align: center;
}

.battle-result-row > div {
    margin: 10px;
    width: 20%;
}
.battle-result-backButton {
    width: 150px;
    height: 50px;
    line-height: 50px;
    border: 2px solid #fff;
}

.battle-result-backButton:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.record-row { height: 50px; }
.record-header-row { height: 35px; }
.record-item { width: calc(100% / 6); }
</style>
