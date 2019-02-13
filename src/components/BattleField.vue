<!-- HTML part -->
<template>
  <div>
    <pd2royaleBattleField v-if='gameModule === "pd2royale"'/>
  </div>
</template>

<!-- js part -->
<script>
import pd2royaleBattleField from '@/components/gameBattleField/pd2royaleBattleField'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'battlefield',
  components: { pd2royaleBattleField },
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
