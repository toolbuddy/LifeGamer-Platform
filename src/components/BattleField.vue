<!-- HTML part -->
<template>
  <div>
    <pd2royaleBattleField v-if='gameModule === "pd2royale"'/>
    <pd2sudokuBattleField v-if='gameModule === "pd2sudoku"'/>
  </div>
</template>

<!-- js part -->
<script>
import pd2royaleBattleField from '@/components/gameBattleField/pd2royaleBattleField'
import pd2sudokuBattleField from '@/components/gameBattleField/pd2sudokuBattleField'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'battlefield',
  components: { pd2royaleBattleField, pd2sudokuBattleField },
  computed: {
    ...mapState('platform', ['gameModule'])
  },
  methods: {
    ...mapActions('platform', ['getServerStatus'])
  },
  created: function () {
    this.getServerStatus()
  }
}
</script>

<!-- css part -->
<style scoped>
</style>
