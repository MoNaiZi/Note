<template>
  <div class="edited_main">
    <!-- <Tree
      :data="data"
      label="title"
      children="childrens"
      :load="loadNode"
      :lazy="true"
    /> -->
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden; text-align: left"
        v-model="html"
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
      data: [
        {
          title: "一级",
          childrens: [
            {
              title: "二级1",
              childrens: [
                {
                  title: "三级1",
                },
              ],
            },
            {
              title: "二级2",
              childrens: [
                {
                  title: "三级2",
                },
              ],
            },
          ],
        },
        {
          title: "一级2",
          childrens: [
            {
              title: "二级2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
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
    edited_main.addEventListener("click", () => {
      store.dispatch("header/setIsEditedTitle", false);
    });
  },

  async created() {
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
      let tempOjb = {};
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

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.edited_main {
  // overflow-y: auto;
  // height: 79vh;
}
</style>