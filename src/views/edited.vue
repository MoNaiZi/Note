<template>
  <!-- <button @click="getValue">getValue</button> -->
  <div class="edited_main">
    <!-- <Tree
      :data="data"
      label="title"
      children="childrens"
      :load="loadNode"
      :lazy="true"
    /> -->
    <div style="border: 1px solid #ccc; height: 100%">
      <Toolbar
        ref="Toolbar"
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        class="editor"
        style="height: 80%; overflow-y: hidden; text-align: left"
        v-model="note.html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>
<script>
import { store } from "@/store";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
// import Tree from "@/components/Tree/index.vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor } from "@wangeditor/editor";
const getQueryByName = (name) => {
  const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`);
  const queryNameMatch = window.location.hash.match(queryNameRegex);
  return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : "";
};
export default {
  components: {
    // Tree,
    Editor,
    Toolbar,
  },

  computed: {
    ...mapState("header", {
      header: (state) => state.note,
    }),
  },
  data() {
    return {
      note: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      editor: null,
      toolbarConfig: {
        excludeKeys: ["group-video", "undo", "redo", "group-image"],
      },
      editorConfig: { placeholder: "请输入内容...", readOnly: false },
      mode: "default", // or 'simple'
      upKeyCode: -1,
    };
  },
  methods: {
    watchKey() {
      window.addEventListener("keydown", (e) => {
        let keyCode = e.keyCode;
        console.log("key", e);
        if (e.key === "s" && keyCode === 83) {
          console.log("保存");
        }
      });
    },
    getValue() {
      const html = this.editor.getHtml();
      const text = this.editor.getText();
      const children = this.editor.children;
      console.log("html", html);
      console.log("text", text);
      console.log("children", children);
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      const MENU_CONF = this.editor.getConfig().MENU_CONF;

      console.log(
        "代码语言",
        this.editor.getMenuConfig("codeSelectLang").codeLangs
      );
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
      const that = this;
      this.$nextTick(() => {
        const toolbar = DomEditor.getToolbar(that.editor);
        let toolbarKeys = toolbar.getConfig().toolbarKeys;
        console.log("toolbarKeys", toolbarKeys);
      });
    },
    loadNode(node, resolve) {
      const { layer, childrens } = node;
      if (childrens && childrens.length > 0) {
        resolve(childrens);
      } else {
        setTimeout(() => {
          resolve([
            {
              title: `第${layer}层`,
            },
          ]);
        }, 1500);
      }
    },
  },
  mounted() {
    let edited_main = document.querySelector(".edited_main");
    // setTimeout(() => {
    //   console.log("DomEditor", DomEditor.getToolbar(this.editor).getConfig());
    // }, 2000);

    edited_main.addEventListener("click", () => {
      store.dispatch("header/setIsEditedTitle", false);
    });
  },

  async created() {
    this.watchKey();
    let winId = getQueryByName("winId");
    let note = {};
    if (winId === "undefined") {
      note._id = this.$createdId();
    } else {
      note = await ipcRenderer.invoke("getNote", winId);
    }
    this.note = note;
    console.log("note", note);
    store.dispatch("header/setNote", note);
    store.dispatch("header/setPageTypeText", "edited");

    addEventListener("unload", () => {
      let { note } = this;
      let { title } = this.header;
      const html = this.editor.getHtml();
      // const text = this.editor.getText();
      let tempOjb = { html };
      if (title) {
        tempOjb.title = title;
      }
      ipcRenderer.send("closeEdited", note._id, tempOjb);
    });

    ipcRenderer.once("provide-worker-channel", (event) => {
      console.log("收到回复");
      // 一旦收到回复, 我们可以这样做...
      const [port] = event.ports;
      // ... 注册一个接收结果处理器 ...
      port.onmessage = (event) => {
        console.log("received result:", event.data);
      };
      // ... 并开始发送消息给 work!
      port.postMessage(21);
    });
  },
  beforeUnmount() {},
};
</script>


<style lang="scss" scoped>
.editor {
  // ::v-deep .w-e-text-container [data-slate-editor] p {
  //   margin: 4px 0;
  // }
  ::v-deep .w-e-bar-bottom .w-e-select-list {
    margin-bottom: -140px;
    .w-e-select-list ul li {
      top: 0%;
    }
  }
  ::v-deep .w-e-text-container * {
    margin: 4px 0;
  }
}
.edited_main {
  // overflow-y: auto;
  height: 90vh;
}
</style>