<template>
  <Editor
    class="editor"
    style="overflow-y: hidden; text-align: left; height: 500px"
    :key="id"
    v-model="data.html"
    :defaultConfig="editorConfig"
    :mode="'default'"
    @onCreated="onCreated"
    @onFocus="onFocus"
    @onBlur="onBlur"
    @onChange="onChange"
  />
</template>
<script lang="ts">
import { Editor } from "@wangeditor/editor-for-vue";
import { SlateEditor } from "@wangeditor/editor";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    currentItem: {} as any,
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
      editor: {} as any,
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
    getEditor() {
      this.$emit("getEditor", this.editor);
    },
    onChange(editor: any) {
      // if (!editor.isFocused()) {
      //   // editor.focus(true);
      // }
      SlateEditor.end(editor, []);
      console.log("onChange", editor.isFocused());
    },
    onBlur() {
      console.log("onBlur");
    },
    onFocus() {
      console.log("onFocus");
      // this.$emit("onFocus");
    },
    preventBlur(event: any) {
      event.preventDefault();
    },
    onCreated(editor: any) {
      this.editor = editor;
    },
  },
  unmounted() {
    console.log("销毁");
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy();
  },
});
</script>
<style lang="scss" scoped>
.editor {
  // height: 80%;
  text-align: left;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>