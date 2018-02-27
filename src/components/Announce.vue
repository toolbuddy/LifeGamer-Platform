<!-- HTML part -->
<template>
    <div id="markdown-body">
        <section class="edit-wrapper" v-if="inEdit">
          <section class="edit-section">
            <textarea class="editor" v-model="markdownString" spellcheck="false" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+ '\t' +v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
</textarea>
          </section>
          <section class="edit-section">
            <section class="edit-result" v-html="renderMD"></section>
          </section>
        </section>
        <section v-else v-html="renderMD" class="result"></section>
    </div>
</template>

<!-- js part -->
<script>
var marked = require('marked')
var hljs = require('highlight.js')
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  name: 'Announce',
  data: function () {
    return {
      markdownString: '',
      is_admin: false,
      edit: false,
      inEdit: false
    }
  },
  computed: {
    renderMD: function () {
      return marked(this.markdownString)
    }
  },
  watch: {
    '$route.query.edit': function () {
      let _inedit = this.inEdit
      this.edit = this.$route.query.edit
      this.inEdit = this.edit && this.is_admin
      /* change mode from edit to result */
      if (!this.inEdit && _inedit) this.sendWebContent()
    }
  },
  created: function () {
    /* getting data from server */
    this.getWebContent()
    /* check is admin or not */
    this.checkAdmin()
    /* get query string */
    this.edit = this.$router.currentRoute.query.edit
  },
  methods: {
    getWebContent: function () {
      this.$http
        .get('https://hmkrl.com/db_page?method=get&page=Announce')
        .then(response => {
          this.markdownString = response.bodyText
          console.log(response)
        })
    },
    checkAdmin: function () {
      let cookie = this.$cookies.get('token')
      this.$http
        .get(`https://hmkrl.com/gitlab/api/v4/user?access_token=${cookie}`)
        .then(response => {
          this.is_admin = response.body.is_admin
        })
    },
    sendWebContent: function () {
      this.$http
        .get(
          `https://hmkrl.com/db_page?method=set&page=Announce&content=${
            this.markdownString
          }`
        )
        .then(response => {
          console.log(response)
        })
    }
  }
}
</script>

<!-- css part -->
<style scope>
#markdown-body {
  margin-top: 50px;
}

.edit-wrapper {
  display: flex;
  justify-content: space-around;
  padding-top: 25px;
}

.edit-section {
  float: left;
  width: 48vw;
  height: 90vh;
  border: 2px solid #888;
  box-sizing: border-box;
  padding: 5px;
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

<style scope src="./style/monokai-sublime.css"></style>
<style scope src="./style/github-style.css"></style>
