<template>
  <div ref="codeEditor" style="width: 100%;position: absolute;height: calc(100% - 50px);bottom: 50px;margin-top:50px">
    private void SayHi()
    {
    Console.WriteLine("Hello,world");
    }
  </div>
</template>

<script>
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/mode-html'
import "ace-builds/src-noconflict/ext-language_tools"


export default {
  name: "ActiveView",
  data() {
    return {
      aceEditor: null
    }
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.codeEditor, {
      behavioursEnabled: true,
      indentedSoftWrap: false,
      wrapBehavioursEnabled: true,
      enableAutoIndent: true,
      showInvisibles: false,
      displayIndentGuides: true,
      highlightSelectedWord: true,
      useWorker: true,
      animatedScroll: false,
      showPrintMargin: false,
      wrap: "free",
      tabSize: 4,
      fontSize: 21,
      theme: "ace/theme/one_dark",
      mode: "ace/mode/csharp"
    });
    this.aceEditor.setOption({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
  },
  methods: {}
}
</script>

<style>
.ace_mobile-menu {
  display: none
}

.ace-one-dark .ace_marker-layer .ace_selection {
  background: #000;
  border: none
}

.ace-one-dark .ace_marker-layer .ace_selected-word {
  border-color: #b0b0b0
}
</style>