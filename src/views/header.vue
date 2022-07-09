<template>
  <div
    :class="[
      'header_main',
      { edited: pageTypeText === 'edited' },
      { home: pageTypeText != 'edited' },
    ]"
  >
    <div class="left">
      <i v-show="pageTypeText === 'edited'">
        <el-icon @click="minimize">
          <Minus />
        </el-icon>
        <el-icon @click="showTiming">
          <Bell />
        </el-icon>
      </i>

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
    <drag class="title">
      <div v-show="pageTypeText != 'edited'">便利贴</div>
      <div class="input_title" v-show="pageTypeText === 'edited'">
        <div @dblclick="editedTitle" v-if="!isEditedTitle">
          <el-tooltip
            class="item"
            effect="light"
            content="双击编辑，或者长按拖动"
            placement="right-end"
          >
            {{ note.title }}
          </el-tooltip>
        </div>

        <input v-else v-model="note.title" placeholder="请输入标题" />
      </div>
    </drag>

    <div class="right">
      <img
        @click="zoomInAndOut"
        v-show="pageTypeText === 'edited'"
        :src="
          note.isZoomInAndOut
            ? require('@/assets/reduction_window.png')
            : require('@/assets/maximize.png')
        "
      />
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
  <transition name="main-fade">
    <router-view> </router-view>
  </transition>
  <el-dialog
    v-model="isShowTiming"
    title="定时提醒"
    width="60%"
    :before-close="showTiming"
    draggable
  >
    <div>
      <el-date-picker
        v-model="note.timing"
        type="datetime"
        placeholder="请选择提醒时间"
        popper-class="timing_date_picker"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="showTiming(0)">取消</el-button> -->
        <el-button type="primary" @click="showTiming(1)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { store } from "@/store";

const { ipcRenderer } = require("electron");
import drag from "@/components/drag";
export default {
  components: {
    drag,
  },
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
      isShowTiming: false,
    };
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home_note", this.note);
    if (this.note && this.note.title) {
      store.dispatch("header/setIsEditedTitle", false);
    }
    window.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode;
      if (keyCode === 13) {
        store.dispatch("header/setIsEditedTitle", false);
      }
    });
  },
  mounted() {},
  methods: {
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
      ipcRenderer.send("newWindow");
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
    width: 79%;
    margin-left: 57px;
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
    width: 30%;
    text-align: right;
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