<template>
  <div
    :class="[
      'main',
      { edited: pageTypeText === 'edited' },
      { home: pageTypeText != 'edited' },
    ]"
  >
    <div class="left">
      <i v-show="pageTypeText === 'edited'"> 拖动 </i>

      <i
        v-show="pageTypeText === 'home'"
        class="iconfont icon-add"
        @click="addNote"
      ></i>
      <i
        v-show="pageTypeText === 'set'"
        class="iconfont icon-back"
        @click="this.$router.push('/')"
      ></i>
    </div>
    <div class="title" v-show="pageTypeText != 'edited'">便利贴</div>
    <div class="input_title" v-show="pageTypeText === 'edited'">
      <div v-if="!isEditedTitle" @dblclick="editedTitle">
        {{ note.title }}
      </div>
      <input v-else v-model="note.title" placeholder="请输入标题" />
    </div>
    <div class="right">
      <i
        :class="['iconfont', isTopping ? 'icon-thepin-active' : 'icon-thepin']"
        @click="topping"
      ></i>
      <i
        v-show="pageTypeText === 'home'"
        class="iconfont icon-setting"
        @click="toSet"
      ></i>

      <i class="iconfont icon-close" @click="close"></i>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { store } from "@/store";
const { ipcRenderer } = require("electron");
export default {
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
      note: (state) => state.note || {},
      isEditedTitle: (state) => state.isEditedTitle,
    }),
  },
  watch: {},
  data() {
    return {
      isTopping: false,
    };
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home", this.$router);
    let watchNote = null;
    watchNote = this.$watch(
      "note",
      (note) => {
        if (note && note.title) {
          store.dispatch("header/setIsEditedTitle", false);
        }
        if (watchNote) {
          watchNote();
        }
      },
      {
        deep: true,
      }
    );
    window.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode;
      if (keyCode === 13) {
        store.dispatch("header/setIsEditedTitle", false);
      }
    });
  },
  mounted() {},
  methods: {
    editedTitle() {
      store.dispatch("header/setIsEditedTitle", true);
    },
    topping() {
      this.isTopping = !this.isTopping;
      ipcRenderer.send("topping", this.isTopping);
    },
    close() {
      const pageTypeText = this.pageTypeText;
      let { note } = this;
      if (pageTypeText === "edited") {
        store.dispatch("header/setNote", note);
      }
      ipcRenderer.send("closeWindow", note._id);
    },

    addNote() {
      ipcRenderer.send("newWindow");
      // let height = window.screen.height * window.devicePixelRatio;
      // let width = window.screen.width * window.devicePixelRatio;
      // ipcRenderer.send("newMenu", { width, height });
    },
    toSet() {
      this.$router.push("/set");
    },
  },
};
</script>

<style lang="scss" scoped>
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
    width: 65%;
    div {
      width: 120%;
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
    @extend .drag;
  }
}
.home {
  .iconfont {
    @include iconfont(25px);
  }
}

.main {
  display: flex;
  justify-content: space-between;
  margin: 10px 5px;
  text-align: center;
  align-items: center;
  div {
    width: 20%;
  }
  .left {
    text-align: left;
  }
  .title {
    @extend .drag;
    width: 30%;
    text-align: right;
  }

  .right {
    text-align: right;
    width: 35%;
    i {
      margin-left: 10px;
    }
  }
}
</style>