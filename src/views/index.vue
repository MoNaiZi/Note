<template>
  <el-input
    v-model="input3"
    class="w-50 m-2"
    placeholder="请输入标题"
    :suffix-icon="'Search'"
  />
  <contextMenu
    :X="X"
    :Y="Y"
    :menuShow="showMenu"
    @change="changeMenu"
  ></contextMenu>

  <div class="list">
    <transition-group name="flip-list" tag="ul">
      <li
        v-for="item in list"
        :key="item"
        class="item"
        @click="edited(item)"
        @contextmenu="handleContextMenu($event, item)"
      >
        <div>
          <h3>{{ item.title }}</h3>
          <div class="content"></div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { store } from "@/store";
import { mapGetters } from "vuex";
import contextMenu from "@/components/context_menu.vue";
const { ipcRenderer } = require("electron");
export default {
  components: {
    contextMenu,
  },
  data() {
    return {
      showMenu: false,
      currentItem: {},
      X: 0,
      Y: 0,
    };
  },
  computed: {
    ...mapGetters("note", {
      list: "getNoteList",
    }),
  },
  beforeCreate() {
    console.log("实例化初始之后");
  },
  created() {
    console.log("在实例创建完成");
    // const that = this;
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
      store.dispatch("note/setNoteList", list);
    });
    ipcRenderer.on("getEdited", (_event, list) => {
      store.dispatch("note/setNoteList", list);
    });
    // window.electronAPI.getList().then((list) => {
    //   that.list = list;
    // });
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
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
    edited(item) {
      ipcRenderer.send("newWindow", item._id);
    },
    changeMenu(type) {
      console.log("type", type);
      const currentItem = this.currentItem;
      switch (type) {
        case 0:
          break;
        case 1:
          ipcRenderer.invoke("removeNote", currentItem._id).then((list) => {
            console.log("list", list);
            store.dispatch("note/setNoteList", list);
          });
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
* {
  margin: 0px;
  padding: 0px;
}
.list {
  height: 83vh;
  overflow: auto;

  .item {
    width: 93%;
    height: 67px;
    padding: -4px;
    box-shadow: 0 0 4px #cbcbcb;
    cursor: pointer;
    margin: 10px auto;
    border-radius: 5px;
    text-align: left;
    padding: 6px;
    .content {
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
