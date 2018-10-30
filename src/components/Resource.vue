<!-- HTML part -->
<template>
    <div id="markdown-body">
        <section class="edit-wrapper" v-if="editMode">
          <section class="edit-section">
            <textarea class="editor" v-model="markdownString" spellcheck="false" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+ '\t' +v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
</textarea>
          </section>
          <section class="edit-section">
            <section class="edit-result" v-html="markedString"></section>
          </section>
        </section>
        <section v-else v-html="markedString" class="result"></section>
    </div>
</template>

<!-- js part -->
<script>
import './style/monokai-sublime.css'
import './style/github-style.css'
import { mapState, mapGetters, mapActions } from 'vuex'

const axios = require('axios')
var marked = require('marked')
var hljs = require('highlight.js')
marked.setOptions({
  highlight: function (code) { return hljs.highlightAuto(code).value }
})

const config = require('../../config/config')[process.env.NODE_ENV]

export default {
  name: 'Announce',
  data: function () {
    return {
      markdownString: ''
    }
  },
  computed: {
    ...mapState('platform', ['editMode', 'token']),
    ...mapGetters('platform', ['isAdmin']),
    markedString: function () { return marked(this.markdownString) }
  },
  created: function () {
    this.getServerStatus()
    this.getWebContent() // getting webcontent from server
  },
  watch: {
    editMode: function (newValue, oldValue) {
      if (!newValue && oldValue) { // watch negEdge
        if (this.isAdmin) { this.sendWebContent() }
      }
    }
  },
  methods: {
    ...mapActions('platform', ['getServerStatus']),
    getWebContent: function () {
      axios.get(`${config.hostname}/markdownContent?page=Resource`).then(response => { this.markdownString = response.data })
    },
    sendWebContent: function () {
      let data = {
        page: 'Resource',
        content: this.markdownString,
        token: this.token
      }
      axios.post(`${config.hostname}/markdownContent`, data, {headers: {'Content-Type': 'application/json'}})
    }
  }
}
</script>

<!-- css part -->
<style scoped>

#markdown-body {
  margin-top: 50px;
  font-size: 24px;
}

.edit-wrapper {
  display: flex;
  justify-content: space-around;
}

.edit-section {
  float: left;
  border: 2px dashed #888;
  box-sizing: border-box;
  margin: 10px;
  padding: 5px;
  overflow: auto;
}

@media screen and (max-width: 1199px) {
  .edit-wrapper {
    flex-direction: column;
  }
  .edit-section {
    height: 49vh;
  }
}

@media screen and (min-width: 1200px) {
  .edit-wrapper {
    flex-direction: row;
  }
  .edit-section {
    width: 48vw;
    height: 98vh;
  }
}

.editor {
  padding: 10px 5px;
  background: none;
  border: 0px;
  color: #000;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 18px;
  outline: none;
  overflow: auto;
}

.edit-result {
  padding: 10px 5px;
}

.result {
  padding: 10px 10%;
}
</style>
