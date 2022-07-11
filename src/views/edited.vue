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
        id="toolbar-container"
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
<script lang="ts">
import { defineComponent } from "vue";
import { store } from "@/store";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
const dayjs = require("dayjs");
// import Tree from "@/components/Tree/index.vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor, Boot } from "@wangeditor/editor";
import { getQueryByName } from "@/utils";
import { ElMessage } from "element-plus";
interface Note {
  title: string | undefined;
  _id: string | undefined;
  html: string | undefined;
  timing: string | undefined;
}
export default defineComponent({
  components: {
    // Tree,
    Editor,
    Toolbar,
  },
  computed: {
    ...mapState("header", {
      header: (state: any) => state.note,
      headerClose: (state: any) => state.close,
    }),
    ...mapState("note", {
      list: (state: any) => state.list,
    }),
  },
  watch: {
    headerClose: {
      deep: true,
      handler(val) {
        if (val) return;
        this.saveEdited();
      },
    },
  },

  data() {
    return {
      skipPageType: 0, //跳进来的页面类型，0 主页，1.悬浮窗
      note: {} as Note,
      defaultProps: {
        children: "children",
        label: "label",
      },
      editor: {} as any,
      toolbarConfig: {
        excludeKeys: ["group-video", "undo", "redo", "group-image"],
      } as any,
      editorConfig: { placeholder: "请输入内容...", readOnly: false },
      mode: "default", // or 'simple'
      upKeyCode: -1,
    };
  },
  methods: {
    saveEdited(typeText?: String) {
      let { timing } = this.header;
      const note = this.header;
      const html = this.editor.getHtml();
      // // const text = this.editor.getText();
      let tempOjb = { html, ...note };
      tempOjb.title = tempOjb.title || "无标题";
      if (timing) {
        tempOjb.timing = timing;
        tempOjb.timinGtimeStamp = dayjs(timing).valueOf();
        tempOjb.timingStatus = 0;
      }

      ipcRenderer.send(
        "closeEdited",
        note._id,
        JSON.parse(JSON.stringify(tempOjb)),
        typeText
      );
      if (typeText != "save") {
        store.dispatch("header/setHeaderClose", false);
      }
    },
    watchKey() {
      window.addEventListener("keydown", (e) => {
        let keyCode = e.keyCode;
        // console.log("key", e);
        if (e.key === "s" && keyCode === 83) {
          this.saveEdited("save");
          ElMessage({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
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
    onCreated(editor: any) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      const MENU_CONF = this.editor.getConfig().MENU_CONF;

      // console.log(
      //   "代码语言",
      //   this.editor.getMenuConfig("codeSelectLang").codeLangs
      // );
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

      this.$nextTick(() => {});
    },
    loadNode(node: any, resolve: any) {
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
    setTimeout(() => {
      const toolbar: any = DomEditor.getToolbar(this.editor);

      let toolbarKeys = toolbar.getConfig().toolbarKeys;
      toolbarKeys.push("|");
      let obj = { toolbarKeys };
      this.toolbarConfig = obj;

      console.log("toolbar", toolbar);
    }, 1000);

    let edited_main: any = document.querySelector(".edited_main");
    edited_main.addEventListener("click", () => {
      const header = this.header;
      if (header && header.title) {
        store.dispatch("header/setIsEditedTitle", false);
      }
    });
  },

  async created() {
    // const MyDropPanelMenu = class IDropPanelMenu {
    //   // 菜单配置，代码可参考“颜色”菜单源码
    // };
    const menu3Conf: any = {
      key: "timing", // menu key ，唯一。注册之后，可配置到工具栏
      title: "定时",
      factory() {},
    };
    Boot.registerMenu(menu3Conf);
    this.watchKey();

    let winId = getQueryByName("winId");
    let note = {} as Note;
    if (winId === "undefined") {
      note._id = this.$createdId();
    } else {
      note = await ipcRenderer.invoke("getNote", winId);
    }

    let skipPageTypeText: string = getQueryByName("skipPageType");
    if (
      typeof skipPageTypeText != "undefined" &&
      !isNaN(parseInt(skipPageTypeText))
    ) {
      let skipPageType: number = parseInt(skipPageTypeText);
      if (skipPageType === 1) {
        note.timing = "";
      }
      this.skipPageType = skipPageType;
    }
    this.note = note || {};
    if (note.title) {
      store.dispatch("header/setIsEditedTitle", false);
    }
    console.log("note", note);
    store.dispatch("header/setNote", note || {});
    store.dispatch("header/setPageTypeText", "edited");

    // window.onbeforeunload = (e) => {
    //   console.log("I do not want to be closed", this);
    //   e.returnValue = false;
    // };

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
  beforeUnmount() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
});
</script>


<style lang="scss" scoped>
.editor {
}
.edited_main {
  // overflow-y: auto;
  height: 90vh;
}
</style>