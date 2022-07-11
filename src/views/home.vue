<template>
  <div :class="['wrap', { isLeft }]">
    <transition name="main-fade">
      <div class="left_main" v-if="isLeft">
        <noteHeader
          key="editor_home"
          :typeText="'left'"
          :title="currentItem.title"
          @close="openLeft"
          @onFocus="onFocus"
        ></noteHeader>
        <keep-alive>
          <noteEditor
            ref="noteEditor"
            key="home_index"
            :currentItem="currentItem"
          />
        </keep-alive>
      </div>
    </transition>

    <transition name="main-fade">
      <div class="right_main">
        <noteHeader></noteHeader>
        <keep-alive>
          <router-view
            @openLeft="openLeft"
            :isLeft="isLeft"
            :leftItem="!isLeft ? currentItem : {}"
            @close="openLeft"
          >
          </router-view>
        </keep-alive>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { store } from "@/store";
import noteEditor from "@/components/note_editor";
const { ipcRenderer } = require("electron");
import noteHeader from "@/components/note_header";
export default {
  components: {
    noteEditor,
    noteHeader,
  },
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
      note: (state) => state.note || {},
      isEditedTitle: (state) => state.isEditedTitle,
    }),
  },
  watch: {
    // currentItem: {
    //   deep: true,
    //   handler(val) {
    //     console.log("home", val);
    //   },
    // },
  },
  data() {
    return {
      isTopping: false,
      isShowTiming: false,
      isLeft: false,
      isOpenLeft: false,
      currentItem: {},
      isBlur: false,
    };
  },
  created() {
    // this.$router.psuh('/set')
    // console.log("home_note", this.note);
    const that = this;
    if (that.note && that.note.title) {
      store.dispatch("header/setIsEditedTitle", false);
    }

    window.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode;
      // console.log("keyCode home", keyCode);
      if (keyCode === 13) {
        store.dispatch("header/setIsEditedTitle", false);
      }
    });
  },
  mounted() {},
  methods: {
    onFocus() {
      console.log("onFocus");
      this.isBlur = true;
    },
    changeEditor(editor) {
      // console.log("editor", editor);
      this.currentItem.html = editor.getHtml();
    },
    openLeft(item, bool = null) {
      console.log("打开右侧", bool);
      if (!item) {
        this.isLeft = false;
        return;
      }

      item = JSON.parse(JSON.stringify(item));
      if (item && item._id != this.currentItem._id) {
        this.isLeft = true;
      } else {
        this.isLeft = false;
      }
      if (bool != null && typeof bool != "undefined") {
        this.isLeft = bool;
      }
      if (this.isOpenLeft != this.isLeft) {
        this.isOpenLeft = this.isLeft;

        // ipcRenderer.invoke("openLeft", this.isLeft);
      }
      if (this.isOpenLeft) {
        this.currentItem = item;
      } else {
        this.currentItem = {};
      }
    },
    zoomInAndOut() {
      const note = this.note;
      note.isZoomInAndOut = !note.isZoomInAndOut;
      store.dispatch("header/setNote", note);
      ipcRenderer.send("zoomInAndOut");
    },
    showTiming(type) {
      this.isShowTiming = !this.isShowTiming;
      if (type === 1) {
        store.dispatch("header/setNote", this.note);
      }
    },
    minimize() {
      ipcRenderer.send("minimize");
    },
    editedTitle() {
      store.dispatch("header/setIsEditedTitle", true);
    },
    topping() {
      this.isTopping = !this.isTopping;
      ipcRenderer.send("topping", this.isTopping);
    },
    async close() {
      const pageTypeText = this.pageTypeText;
      let { note } = this;
      if (pageTypeText === "edited") {
        store.dispatch("header/setHeaderClose", false);
        store.dispatch("header/setNote", note);
      } else {
        await ipcRenderer.send("closeWindow", note._id);
      }
    },

    addNote() {
      ipcRenderer.invoke("newWindow");
    },
    toSet() {
      this.$router.push("/set");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  background: #fff;
  border-radius: 10px;
  height: 100%;
  .right_main {
    // width: 100%;
    // height: 100%;
  }
  .left_main {
    height: 100vh;
    width: 350px;
    border-right: 2px dashed #d0d0d0;
    h4 {
      margin: 10px;
    }
    // background: #000;
  }
}
.drag {
  -webkit-app-region: drag;
}
@mixin iconfont($size) {
  font-size: $size;
  cursor: pointer;
}

.edited {
  .iconfont {
    @include iconfont(20px);
  }
  .input_title {
    width: 79%;
    margin-left: 57px;
    text-align: center;
    div {
      width: 100%;
    }
    input {
      box-shadow: 0 0 4px #cbcbcb;
      border: 0px;
      width: 73%;
      padding: 4px;
      border-radius: 5px;
      text-align: center;
    }
  }
  .left {
    line-height: 10px;
    cursor: pointer;
    .el-icon {
      margin-right: 10px;
    }
  }
}
.home {
  .iconfont {
    @include iconfont(25px);
  }
}

.header_main {
  width: 350px;
  display: flex;
  justify-content: space-between;
  padding: 8px 5px;
  text-align: center;
  align-items: center;
  div {
    // width: 20%;
  }
  .left {
    text-align: left;
  }
  .title {
    // @extend .drag;
    width: 42%;
    // text-align: right;
  }

  .right {
    text-align: right;
    width: 35%;
    display: flex;
    align-items: center;
    justify-content: end;
    img {
      width: 17px;
      cursor: pointer;
      opacity: 0.8;
    }
    i {
      margin-left: 10px;
    }
  }
}
</style>