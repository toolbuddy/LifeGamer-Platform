<!-- HTML part -->
<template>
    <div id="markdown-body">
        <section v-if="loaded" v-html="markdownString"></section>
    </div>
</template>

<!-- js part -->
<script>
export default {
  name: 'Announce',
  data: function () {
    return {
      markdownString: '',
      loaded: false
    }
  },
  created: function () {
    /* getting data from server */
    this.getWebContent()
    var marked = require('marked')
    var hljs = require('highlight.js')
    marked.setOptions({
      highlight: function (code) {
        return hljs.highlightAuto(code).value
      }
    })
    this.markdownString = marked(this.markdownString)
  },
  mounted: function () {
    /* add class hljs for code section */
    let codeSection = Array.from(document.querySelectorAll('code'))
    codeSection.forEach(item => {
      item.classList.add('hljs')
    })
  },
  methods: {
    getWebContent: function () {
      this.$http
        .get('https://hmkrl.com/db_page?method=get&page=Announce')
        .then(response => {
          this.markdownString = response.body
          this.loaded = true
        })
    }
  }
}
</script>

<!-- css part -->
<style scope>
#markdown-body {
  margin-top: 25px;
  padding: 1.5rem;
}
</style>

<style scope src="./style/monokai-sublime.css"></style>
