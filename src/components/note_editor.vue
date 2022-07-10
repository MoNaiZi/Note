<template>
  <Editor
    @mouseup="preventBlur($event)"
    style="overflow-y: hidden; text-align: left; height: 500px"
    :key="id"
    v-model="data.html"
    :defaultConfig="{ placeholder: '请输入内容...' }"
    :mode="'default'"
    :id="id"
    @onCreated="handleCreated"
  />
</template>
<script>
import { Editor } from "@wangeditor/editor-for-vue";
export default {
  props: {
    currentItem: {},
  },
  watch: {
    currentItem: {
      deep: true,
      handler(val) {
        this.data = val;
      },
    },
  },
  data() {
    return {
      id: this.$createdId(),
      data: this.currentItem,
      editor: {},
    };
  },
  components: {
    Editor,
  },
  mounted() {
    // const that = this;
    // window.addEventListener("keydown", () => {
    //   //   console.log("editor", that.editor);
    //   if (that.editor.focus) {
    //     // that.editor.focus();
    //   }
    // });
  },
  methods: {
    preventBlur(event) {
      event.preventDefault();
    },
    handleCreated(editor) {
      editor.focus();
      this.editor = editor;
    },
  },
  unmounted() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy();
  },
};
</script>
<style>
</style>