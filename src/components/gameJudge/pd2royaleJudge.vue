<template>
  <div class="gameRendering">
    <div><h4>Level 1:</h4><pre id="level-1" class="gameProcess" v-html="this.JudgeProcess('level1')"></pre></div>
    <div><h4>Level 2:</h4><pre id="level-2" class="gameProcess" v-html="this.JudgeProcess('level2')"></pre></div>
    <div><h4>Level 3:</h4><pre id="level-3" class="gameProcess" v-html="this.JudgeProcess('level3')"></pre></div>
    <div><h4>Level 4:</h4><pre id="level-4" class="gameProcess" v-html="this.JudgeProcess('level4')"></pre></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pd2royaleJudge',
  computed: {
    ...mapGetters('gameJudge', ['JudgeProcess'])
  }
}
</script>

<style scoped>
.gameRendering {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 20px;
}

.gameProcess {
  width: 450px;
  height: 450px;
  color: #fff;
  margin: 0;
}
</style>
