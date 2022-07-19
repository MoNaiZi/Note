<template>
  <div>
    <Toolbar
      v-show="showToolBar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      v-model="valueHtml"
      @onCreated="handleCreated"
      @onChange="onChange"
      class="editor"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeUnmount,
  shallowRef,
  reactive,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { IDomEditor } from "@wangeditor/editor";
import { mapState } from "vuex";
export default defineComponent({
  computed: {
    ...mapState("note", {
      showToolBar: (state: any) => state.showToolBar,
    }),
  },
  components: {
    Editor,
    Toolbar,
  },
  props: {
    currentItem: {} as any,
  },
  watch: {
    currentItem: {
      deep: true,
      handler(val) {
        this.valueHtml = val.html;
      },
    },
  },
  setup(props: any, { emit }) {
    // 编辑器唯一id值
    const editorRef = shallowRef<IDomEditor | undefined>(undefined);
    let valueHtml = ref(props.currentItem.html);
    // 编辑器相关配置
    const editorConfig = {
      placeholder: "请输入内容...",
      readOnly: false,
    };

    const handleCreated = (editor: IDomEditor) => {
      editorRef.value = editor;
      const MENU_CONF: any = editor.getConfig().MENU_CONF;
      MENU_CONF["codeSelectLang"] = {
        // 代码语言
        codeLangs: [
          { text: "Javascript", value: "javascript" },
          { text: "CSS", value: "css" },
          { text: "HTML", value: "html" },
          { text: "Typescript", value: "typescript" },
          // 其他
        ],
      };
    };

    let currentItem = reactive(props.currentItem);
    const onChange = (ediotr: IDomEditor) => {
      let html = ediotr.getHtml();
      emit("onChange", { html, _id: currentItem._id });
    };
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor: any = editorRef.value;
      console.log("组件销毁时，也及时销毁编辑器");
      if (editor == null) return;
      editor.destroy();
    });

    return {
      editorRef,
      editorConfig,
      valueHtml,
      toolbarConfig: {
        excludeKeys: [
          "group-video",
          "undo",
          "redo",
          "group-image",
          "fullScreen",
        ],
      },
      handleCreated,
      onChange,
    };
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