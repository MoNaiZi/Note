<template>
  <el-input
    v-model="searchKey"
    class="w-50 m-2"
    placeholder="请输入标题"
    :suffix-icon="'Search'"
    @input="search"
  />
  <contextMenu
    :X="X"
    :Y="Y"
    :menuShow="showMenu"
    @change="changeMenu"
  ></contextMenu>

  <div class="list">
    <transition-group name="scale" tag="ul">
      <li
        v-for="(item, index) in list"
        :key="item._id"
        class="item"
        @contextmenu="handleContextMenu($event, item)"
      >
        <div>
          <h4 @click="edited(item)">
            {{ item.title }}
            <el-icon
              class="ArrowDownBold"
              @click.stop="openDetaile(item, index)"
            >
              <ArrowDownBold v-show="item.isOpenDetaile" />
              <ArrowLeftBold v-show="!item.isOpenDetaile" />
            </el-icon>
          </h4>
          <div class="content">
            <!-- <el-icon class="ArrowDownBold" @click="openDetaile(item)">
              <ArrowDownBold v-show="item.isOpenDetaile" />
              <ArrowLeftBold v-show="!item.isOpenDetaile" />
            </el-icon> -->

            <Editor
              class="editor"
              style="overflow-y: hidden; text-align: left"
              :style="{ height: !item.isOpenDetaile ? '50px' : '200px' }"
              v-model="item.html"
              :defaultConfig="{ placeholder: '请输入内容...' }"
              :mode="'default'"
            />

            <div class="time">
              <el-tooltip
                class="item"
                effect="light"
                :content="item.time"
                placement="right-end"
              >
                {{ fromNowFn(item.timeStamp) }}
              </el-tooltip>
            </div>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script >
import { store } from "@/store";
import { mapGetters } from "vuex";
import contextMenu from "@/components/context_menu.vue";
import { Editor } from "@wangeditor/editor-for-vue";
import { fromNow } from "@/utils";
const { ipcRenderer } = require("electron");
export default {
  components: {
    contextMenu,
    Editor,
  },
  data() {
    return {
      list: [],
      searchKey: "",
      showMenu: false,
      currentItem: {},
      X: 0,
      Y: 0,
    };
  },
  computed: {
    ...mapGetters("note", {
      // list: "getNoteList",
    }),
  },
  beforeCreate() {
    console.log("实例化初始之后");
  },
  created() {
    console.log("在实例创建完成");

    const that = this;
    // const channel = new MessageChannel();
    // console.log("ipcRenderer", ipcRenderer);
    store.dispatch("header/setPageTypeText", "home");
    console.log("ipcRenderer", ipcRenderer);
    console.log("window", window);

    window.onmessage = (event) => {
      // event.source === window 表示消息来自预加载脚本
      // 而不是来自 <iframe> 或其他来源
      this.event = event;
      if (event.source === window && event.data === "main-world-port") {
        console.log("event", event);
        const [port] = event.ports;
        // 一旦我们有了这个端口，我们就可以直接与主进程通信
        port.onmessage = (event) => {
          console.log("from main process:", event.data);
          let test = event.data.test;
          port.postMessage(test * 2);
        };
      }
    };

    ipcRenderer.invoke("getList").then((list) => {
      that.list = list;
      // store.dispatch("note/setNoteList", list);
    });
    ipcRenderer.on("getEdited", (_event, list) => {
      that.list = list;
      // store.dispatch("note/setNoteList", list);
    });
    // window.electronAPI.getList().then((list) => {
    //   that.list = list;
    // });
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
    window.onbeforeunload = (e) => {
      console.log("I do not want to be closed");

      // 与通常的浏览器不同,会提示给用户一个消息框,
      //返回非空值将默认取消关闭
      //建议使用对话框 API 让用户确认关闭应用程序.
      // this.close();
      ipcRenderer.send("closeWindow");
      e.returnValue = false;
    };
  },
  beforeMount() {
    console.log("挂载之前");
  },
  mounted() {
    console.log("实例挂载完成后");
  },
  beforeUpdate() {
    console.log("数据发生改变后DOM被更新之前调用");
  },
  updated() {
    console.log("在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。");
  },
  methods: {
    fromNowFn(time) {
      return fromNow(time);
    },
    openDetaile(item) {
      let isOpenDetaile =
        typeof item.isOpenDetaile === "undefined" ? false : item.isOpenDetaile;
      item.isOpenDetaile = isOpenDetaile ? false : true;
      // const that = this;
      ipcRenderer.send("updateNote", JSON.parse(JSON.stringify(item)));
      //isOpenDetaile
    },
    search() {
      let searchKey = this.searchKey;
      ipcRenderer.invoke("search", searchKey).then((res) => {
        store.dispatch("note/setNoteList", res);
      });
    },
    edited(item) {
      ipcRenderer.send("newWindow", item._id);
    },
    changeMenu(type) {
      console.log("type", type);
      const that = this;
      const currentItem = this.currentItem;
      switch (type) {
        case 0:
          ipcRenderer.invoke("noteTopping", currentItem._id).then((list) => {
            // store.dispatch("note/setNoteList", list);
            that.list = list;
          });
          break;
        case 1:
          ipcRenderer.invoke("removeNote", currentItem._id).then((list) => {
            // store.dispatch("note/setNoteList", list);
            that.list = list;
          });
          break;
        case 2:
          this.edited(currentItem);
          break;
        default:
          break;
      }
    },
    handleContextMenu(e, item) {
      e.stopPropagation();
      e.preventDefault();
      this.X = e.clientX;
      this.Y = e.clientY;
      this.currentItem = item;
      this.showMenu = true;
    },
    onmessage() {
      const { port1 } = new MessageChannel();
      ipcRenderer.postMessage("port", { message: "hello" }, [port1]);
    },
  },
};
</script>

<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.scale-enter-active {
  transition: all 0.3s ease-out;
}

.scale-leave-active {
  transition: all 0.3s ease-out;
}

.scale-enter-from,
.scale-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

* {
  margin: 0px;
  padding: 0px;
}
.list {
  height: 83vh;
  overflow: auto;
  overflow-x: hidden;
  .item {
    position: relative;
    width: 93%;
    padding: -4px;
    box-shadow: 0 0 4px #cbcbcb;
    cursor: pointer;
    margin: 10px auto;
    border-radius: 5px;
    text-align: left;
    padding: 6px;
    background: #fff;
    .ArrowDownBold {
      position: absolute;
      font-size: 14px;
      background: #f2f2f2;
      border-radius: 5px;
      padding: 3px;
      z-index: 1;
      right: 6px;
      opacity: 0.6;
    }
    .content {
      position: relative;
      .time {
        font-size: 13px;
        color: #9c9c9c;
        margin-top: 10px;
        position: relative;
        top: 3px;
      }
      .editor {
        transition: all 0.5s;
      }
    }
  }
  .item:hover {
    box-shadow: 0 0 4px #9c9c9c;
  }
}
.w-50 {
  width: 97%;
  margin-left: -3px;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  /**/
}
.father::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #333;
}
::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
