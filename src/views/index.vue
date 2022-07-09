<template>
  <div class="index_main">
    <!-- <div class="left_main"></div> -->
    <div class="">
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
        :currentItem="currentItem"
        @change="changeMenu"
      ></contextMenu>
      <div v-show="isScrollTop" class="top">
        <el-icon @click="toTop"><CaretTop /></el-icon>
      </div>
      <!-- {{ list.length }} -->
      <div class="list">
        <transition-group name="scale" tag="ul">
          <li
            v-for="(item, index) in list"
            :key="item._id"
            :class="['item', { item_active: cuttentIndex == index }]"
            @mousedown.stop="this.cuttentIndex = index"
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
                  :style="{ height: !item.isOpenDetaile ? '60px' : '250px' }"
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
        <div v-if="list.length && searchKey === ''" class="loadMore">
          <span @click.stop="getList" v-if="!loadMoreLoading">{{
            loadMore ? `没有更多了(共${list.length}条)` : "加载更多...."
          }}</span>
          <el-icon v-else class="is-loading" :size="18">
            <Loading />
          </el-icon>
        </div>
        <el-empty
          v-if="!list.length"
          description="什么都没，点击左上角+号按钮添加吧"
        />
      </div>
    </div>
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
      cuttentIndex: -1,
      X: 0,
      Y: 0,
      isScrollTop: false,
      loading: true,
      loadMoreLoading: false,
      loadMore: 0, //0.有更多，1.没有更多了
      pageSize: 10,
      page: 0,
    };
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        const cuttentIndex = this.cuttentIndex;
        let list = val;
        if (cuttentIndex != -1) {
          let item = list[cuttentIndex];
          // console.log("监听list的item", JSON.parse(JSON.stringify(item)));
          ipcRenderer.send("updateNote", JSON.parse(JSON.stringify(item)));
        }
      },
    },
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
    this.getList();
    ipcRenderer.on("getEdited", (_event, tempOjb) => {
      let index = this.list.findIndex((item) => item._id === tempOjb._id);
      this.cuttentIndex = index;
      if (index === -1) {
        this.list.unshift(tempOjb);
        this.cuttentIndex = 0;
      } else {
        this.list[index] = tempOjb;
      }

      // store.dispatch("note/setNoteList", list);
    });
    // window.electronAPI.getList().then((list) => {
    //   that.list = list;
    // });
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
    window.onbeforeunload = (e) => {
      console.log("I do not want to be closed", e);

      // 与通常的浏览器不同,会提示给用户一个消息框,
      //返回非空值将默认取消关闭
      //建议使用对话框 API 让用户确认关闭应用程序.
      // this.close();
      ipcRenderer.send("closeWindow");
      e.returnValue = false;
    };

    window.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode;
      console.log("keyCode", keyCode);
      // if (keyCode === 27) {
      //   this.cuttentIndex = -1;
      // }
    });
  },
  beforeMount() {
    console.log("挂载之前");
  },
  mounted() {
    console.log("mounted");
    const that = this;
    that.loading = false;
    that.listDiv = document.querySelector(".list");
    if (that.listDiv) {
      that.listDiv.addEventListener(
        "scroll",
        function (e) {
          let scrollTop = e.target.scrollTop;
          if (scrollTop > 300) {
            that.isScrollTop = true;
          } else {
            that.isScrollTop = false;
          }
        },
        false
      );
    }

    console.log("实例挂载完成后");
    // let popupWindow = window.open(
    //   `http://localhost:55226/#/edited`,
    //   "_blank",
    //   `width=400,
    // height=300,
    // contextIsolation=no,
    // nodeIntegration=yes,
    // frame=no`
    // );
    // popupWindow.onload = () => {
    //   //now we have access to popup window dom
    //   let myDomElement = document.createElement("div");
    //   myDomElement.innerText = "1111111111111111111111";
    //   popupWindow.document.body.appendChild(myDomElement);
    //   ipcRenderer.send("windowOpen");
    // };
  },
  beforeUpdate() {
    console.log("数据发生改变后DOM被更新之前调用");
  },
  updated() {
    console.log("在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。");
  },
  methods: {
    getList() {
      const that = this;
      let list = that.list;
      let page = that.page;
      let pageSize = that.pageSize;
      ipcRenderer.invoke("getList", page, pageSize).then((resList) => {
        if (resList.length) {
          that.list = list.concat(resList);
          that.page += pageSize;
        } else {
          that.loadMore = 1;
        }
      });
    },
    toTop() {
      // this.list.scrollTop = 0;
      this.listDiv.scroll({ top: 0 });
    },
    fromNowFn(time) {
      return fromNow(time);
    },
    openDetaile(item) {
      this.showMenu = false;
      let isOpenDetaile =
        typeof item.isOpenDetaile === "undefined" ? false : item.isOpenDetaile;
      item.isOpenDetaile = isOpenDetaile ? false : true;
      // const that = this;
      ipcRenderer.send("updateNote", JSON.palrse(JSON.stringify(item)));
      //isOpenDetaile
    },
    search() {
      let searchKey = this.searchKey;
      this.cuttentIndex = -1;
      ipcRenderer.invoke("search", searchKey).then((res) => {
        this.list = res;
        // store.dispatch("note/setNoteList", res);
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
        case 3:
          console.log("打开右侧");
          that.$emit("openLeft", currentItem);

          break;
        default:
          break;
      }
    },
    handleContextMenu(e, item) {
      console.log("clientX", e.clientX, "clientY", e.clientY);
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
.left_main {
  width: 50%;
  height: 100vh;
  background: #000;
  position: absolute;
  left: 0;
}
.index_main {
  height: 600px;
  width: 350px;
}
.top {
  position: absolute;
  background: #000;
  color: #fff;
  border-radius: 50%;
  right: 11px;
  bottom: 20px;
  z-index: 10;
  cursor: pointer;
  .el-icon {
    font-size: 19px;
    width: 23px;
  }
}

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
  height: 86vh;
  overflow: auto;
  overflow-x: hidden;
  .loadMore {
    font-size: 13px;
    cursor: pointer;
  }
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
        position: relative;
        top: 3px;
      }
      .editor {
        transition: all 0.5s;
      }
    }
  }
  .item_active {
    box-shadow: 0 0 10px #9c9c9c;
  }
  .item:hover {
    @extend .item_active;
  }
}
.w-50 {
  width: 96%;
  margin-left: -5px;
}
</style>
