<!-- HTML part -->
<template>
    <section class="section-wrapper">
      <Loading v-if='status === "loading"'></Loading>
      <RepoNotFound v-if='status === "error"'></RepoNotFound>
      <div v-if='status === "done"'>
        <button class="branch-selector" @click="branchDropdownToggle">
          <span>{{ curBranch }}</span>
          <img class="arrow-down" src="../assets/arrow_down_black.svg" />
        </button>
        <div id="branch-select-dropdown">
          <header>Switch branch</header>
          <div v-for="(branch, index) in branchList" :key="index" @click="selectBranch(branch, 1)">
            <img class="check-mark" src="../assets/checkmark-icon.svg" v-if='curBranch === branch' />
            {{ branch }}
          </div>
        </div>
        <div class="commit-row commit-header-row">
          <div class="commit-item commit-shortid">Short ID</div>
          <div class="commit-item commit-title">Title</div>
          <div class="commit-item commit-time">Commit Time</div>
          <div class="commit-item commit-button"></div>
        </div>
        <div class="commit-row" v-for="commit in commits" :key="commit.id">
          <div class="commit-item commit-shortid"><a :href="`${hostname}/gitlab/${userdata.username}/${projectName}/commit/${commit.id}`">{{ commit.short_id }}</a></div>
          <div class="commit-item commit-title"> {{ commit.title }} </div>
          <div class="commit-item commit-time">{{ commit.committed_date }}</div>
          <div class="commit-item commit-button click-button" @click="selectCommit (commit.short_id)">select</div>
        </div>
        <div class="page-select">
          <ul class="pageinaction">
            <li v-if="page > 1" @click="selectPage(curBranch, page-1)">Prev</li>
            <li v-if="commitsLen == 20" @click="selectPage(curBranch, page+1)">Next</li>
          </ul>
        </div>
      </div>
      <pd2royaleJudge v-if='status === "judging" && gameModule === "pd2royale"'></pd2royaleJudge>
      <pd2sudokuJudge v-if='status === "judging" && gameModule === "pd2sudoku"'></pd2sudokuJudge>
    </section>
</template>

<!-- js part -->
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import Loading from '@/components/Loading'

import pd2royaleJudge from '@/components/gameJudge/pd2royaleJudge'
import pd2sudokuJudge from '@/components/gameJudge/pd2sudokuJudge'

import RepoNotFound from '@/components/RepoNotFound'

const config = require('../../config/setting')

export default {
  name: 'commit',
  components: { Loading, pd2royaleJudge, pd2sudokuJudge, RepoNotFound },
  computed: {
    ...mapState('platform', ['hostname', 'projectName', 'gameModule', 'userdata', 'token']),
    ...mapState('judge', ['page', 'curBranch', 'branchList', 'commits', 'status']),
    ...mapState('gameJudge', ['ws']),
    ...mapGetters('judge', ['commitsLen'])
  },
  beforeMount: function () {
    this.getServerStatus()
    this.getBranchList({userID: this.userdata.id, token: this.token})
    this.getCommits({userID: this.userdata.id, branch: 'master', page: this.page, token: this.token})
  },
  methods: {
    ...mapMutations('judge', ['updateBranch', 'updatePage', 'updateStatus']),
    ...mapActions('judge', ['getCommits', 'getBranchList', 'judgeRequest']),
    ...mapActions('platform', ['getServerStatus']),
    ...mapActions('gameJudge', ['createWebSocket']),
    branchDropdownToggle () {
      let dropDown = document.querySelector('div#branch-select-dropdown')
      if (dropDown.style.display === 'none' || dropDown.style.display === '') dropDown.style.display = 'block'
      else dropDown.style.display = 'none'
    },
    selectBranch (branch, page) {
      this.updateStatus('loading')
      this.updateBranch(branch)
      this.getCommits({userID: this.userdata.id, branch: branch, page: page, token: this.token})
    },
    selectPage (branch, page) {
      this.updateStatus('loading')
      this.updatePage(page)
      this.getCommits({userID: this.userdata.id, branch: branch, page: page, token: this.token})
    },
    selectCommit (sha) {
      this.updateStatus('judging')
      this.judgeRequest({userID: this.userdata.id, username: this.userdata.username, sha: sha, branch: this.curBranch, token: this.token})
      if (config.ws_url) this.createWebSocket(this.token)
    }
  }
}
</script>

<!-- css part -->
<style scoped>
.section-wrapper {
  box-sizing: border-box;
  padding: 50px 7%;
}

.branch-selector {
  margin: 20px 0;
  text-align: left;
  color: #444444;
  background: #F3F3F3;
  border: 1px #DADADA solid;
  padding: 5px 10px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 9pt;
  outline: none;
  width: 120px;
  height: 30px;
}

.branch-selector:hover{
  border: 1px #C6C6C6 solid;
  box-shadow: 1px 1px 1px #EAEAEA;
  color: #333333;
  background: #F7F7F7;
  cursor: pointer;
}

.arrow-down {
  float: right;
  height: 70%;
}

.check-mark {
  height: 70%;
  margin: 0 10px;
  padding: 3px 0;
}

#branch-select-dropdown {
  display: none;
  width: 400px;
  position: absolute;
  margin-top: -15px;
  color: #444444;
  background: #F3F3F3;
  border: 1px #DADADA solid;
  padding: 5px 10px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 9pt;
  outline: none;
}

#branch-select-dropdown > header {
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #dfdfdf;
  margin-bottom: 5px;
}

#branch-select-dropdown > div {
  height: 20px;
  line-height: 20px;
  padding: 5px 0;
  border-radius: 2px;
  display: flex;
}

#branch-select-dropdown > div:hover {
  background-color: #ddd;
  cursor: pointer;
}

.commit-row {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #8c8c8c;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.commit-header-row {
  background-color: steelblue;
  color: #fff;
  height: 35px;
}

.commit-item {
  float: left;
  margin: 0 3.4%;
  text-align: center;
}

.commit-title { width: 50%; }
.commit-time { width: 20%; }
.commit-shortid { width: 15%; }
.commit-button { width: 15%; }

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

.commit-button:hover {
  background-color: #009688;
  cursor: pointer;
  color: #fff;
}

@media screen and (min-width: 1200px) {
  .commit-title { display: block; }
}

@media screen and (max-width: 1200px) {
  .commit-title { display: none; }
  .commit-time { width: 50%; }
  .commit-shortid { width: 25%; }
  .commit-button { width: 25%; }
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
