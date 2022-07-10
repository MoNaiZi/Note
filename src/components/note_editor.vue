<template>
  <Editor
    class="editor"
    @mouseup="preventBlur($event)"
    style="overflow-y: hidden; text-align: left; height: 500px"
    :key="id"
    v-model="data.html"
    :defaultConfig="editorConfig"
    :mode="'default'"
    @onCreated="onCreated"
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
      editorConfig: { placeholder: "请输入内容...", readOnly: false },
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
    onCreated(editor) {
      this.editor = editor;
    },
  },
  unmounted() {
    console.log("销毁");
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy();
  },
};
</script>
<style lang="scss" scoped>
.editor {
  height: 80%;
  overflow-y: hidden;
  text-align: left;
}
</style>