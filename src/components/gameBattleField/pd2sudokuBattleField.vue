<template>
  <div class="battleField-wrapper">
    <Loading v-if='status === "loading"'></Loading>
    <!-- The part user not registered yet -->
    <!-- begin -->
    <section v-if='group === "unregistered" && status === "done"' class="unregistered">
        <span class="title">Please choose group</span>
        <div class="group-button" @click="selectGroup('easy')">
            <img src="../../assets/basic.svg" />
            <span>Basic</span>
        </div>
        <div class="group-button" @click="selectGroup('hard')">
            <img src="../../assets/advanced.svg" />
            <span>Advanced</span>
        </div>
    </section>
    <!-- end -->

    <!-- The part user have already registered -->
    <!-- headbar mode select part -->
    <!-- begin -->
    <section v-if='(group === "easy" || group === "hard") && status === "done"'>
        <ul class="mode-select">
            <li class="mode" @click="selectMode('selectCode')">Code select</li>
            <li class="mode" @click="selectMode('battle')">Battle</li>
            <li class="mode" @click="selectMode('dashboard')">Dashboard</li>
            <li class="mode" @click="selectMode('record')">Record</li>
        </ul>
    </section>
    <!-- end -->

    <section v-if='(group === "easy" || group === "hard") && status === "done"'>
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
                    <div class="pipelines-item pipelines-button" v-if='pipeline.score > 15'>
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
        <!-- end -->

        <!-- The dashboard part -->
        <!-- start -->
        <section></section>
        <!-- end -->

        <!-- The record part -->
        <!-- start -->
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
  data: function() {
    return { mode: 'selectCode' }
  },
  computed: {
    ...mapState('platform', ['userdata', 'token', 'hostname', 'projectName']),
    ...mapState('grade', ['status', 'pipelines', 'page']),
    ...mapState('gameBattleField', ['group', 'memberList', 'process']),
    ...mapGetters('grade', ['pipelinesLen'])
  },
  created: function() {
    this.getPipelines({ userID: this.userdata.id, page: this.page, token: this.token })
    this.getUserGroup(this.userdata.username)
  },
  methods: {
    ...mapMutations('grade', ['updatePage', 'updateStatus']),
    ...mapActions('gameBattleField', ['getUserGroup', 'updateUserGroup', 'updateCodeVersion', 'battleRequest']),
    ...mapActions('grade', ['getPipelines']),
    pipelineURL: function (id) {
        return `${this.hostname}/gitlab/${this.userdata.username}/${this.projectName}/pipelines/${id}`
    },
    selectGroup: function (group) {
      this.updateUserGroup({ user: this.userdata.username, group: group })
    },
    selectMode: function (mode) {
        this.mode = mode
        if (mode === 'battle') this.getMemberList(this.group)
    },
    selectPage: function (page) {
        this.updateStatus('loading')
        this.updatePage(page)
        this.getPipelines({ userID: this.userdata.id, page: page, token: this.token })
    },
    selectPipeline: function (pipeline) {
        this.updateCodeVersion({
            user: this.userdata.username,
            userID: this.userdata.id,
            token: this.token,
            job_id: pipeline.artifact_id
        })
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
    margin-top: 2.2rem;
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
</style>
