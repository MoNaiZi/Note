<template>
  <div>
    <div class="">
      <drag @zoomInAndOut="zoomInAndOut">
        <div
          :class="[
            'header_main',
            { edited: ['edited', 'outline'].includes(pageTypeText) },
            { home: pageTypeText != 'edited' },
          ]"
        >
          <div class="left">
            <i v-show="['edited', 'outline'].includes(pageTypeText)">
              <el-icon @click="minimize">
                <Minus />
              </el-icon>
              <el-icon @click="showTiming">
                <Bell />
              </el-icon>
            </i>

            <i
              v-show="pageTypeText === 'home' && typeText === ''"
              class="iconfont icon-add"
              @click.stop="addNote"
            ></i>
            <i
              v-show="pageTypeText === 'set' && typeText === ''"
              class="iconfont icon-back"
              @click="toHome"
            ></i>
          </div>

          <div
            class="title"
            οndragstart="return false;"
            v-show="!['edited', 'outline'].includes(pageTypeText)"
          >
            {{ typeText === "left" ? title || "无标题" : "便利贴" }}
          </div>
          <div
            class="input_title"
            v-show="['edited', 'outline'].includes(pageTypeText)"
          >
            <div @dblclick.stop="editedTitle" v-if="!isEditedTitle">
              <el-tooltip
                class="item"
                effect="light"
                content="双击编辑，或者长按拖动"
                placement="right-end"
              >
                {{ note.title }}
              </el-tooltip>
            </div>

            <input
              v-else
              id="editedTitle"
              v-model="note.title"
              placeholder="请输入标题"
            />
          </div>

          <div class="right">
            <template
              v-if="
                typeText === 'left' ||
                ['edited', 'outline'].includes(pageTypeText)
              "
            >
              <i
                style="margin-right: 10px; margin-top: 2px"
                v-show="note.modeType >= 1"
                @click="switchMode"
              >
                <svg
                  v-if="note.modeType === 1"
                  width="23"
                  height="23"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26 24L42 24"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26 38H42"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26 10H42"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 24L6 24C6 24 7.65685 24 10 24M18 38C12 36 16 24 10 24M18 10C12 12 16 24 10 24"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else
                  width="23"
                  height="23"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26 24L44 24"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 24L18 24"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 38H44"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 38H10"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 10H44"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 10H10"
                    stroke="#979797"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </i>
            </template>
            <img
              @click="zoomInAndOut"
              v-show="pageTypeText === 'edited' || pageTypeText === 'outline'"
              :src="
                note.isZoomInAndOut
                  ? require('@/assets/reduction_window.png')
                  : require('@/assets/maximize.png')
              "
            />
            <i
              v-show="typeText === ''"
              :class="[
                'iconfont',
                isTopping ? 'icon-thepin-active' : 'icon-thepin',
              ]"
              @click="topping"
            ></i>
            <i
              v-show="pageTypeText === 'home' && typeText === ''"
              class="iconfont icon-setting"
              @click.stop="toSet"
            ></i>
            <el-icon v-show="isLeft && !note.modeType" @click="showToolBarFn">
              <Edit />
            </el-icon>
            <i class="iconfont icon-close" @click="close"></i>
          </div>
        </div>
      </drag>
      <contextMenu
        :X="X"
        :Y="Y"
        :menuShow="showMenu"
        @change="changeMenu"
        :menuList="menuList"
      ></contextMenu>
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
    </div>
  </div>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { store } from "@/store";

const { ipcRenderer } = require("electron");
import drag from "@/components/drag.vue";
import { defineComponent } from "vue";
import contextMenu from "@/components/context_menu.vue";
export default defineComponent({
  components: {
    drag,
    contextMenu,
  },
  computed: {
    ...mapState("note", {
      showToolBar: (state: any) => state.showToolBar,
    }),
    ...mapState("header", {
      pageTypeText: (state: any) => state.pageTypeText,
      note: (state: any) => state.note || {},
      isEditedTitle: (state: any) => state.isEditedTitle,
    }),
  },
  props: {
    typeText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    isLeft: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  data() {
    return {
      showMenu: false,
      X: 30,
      Y: 30,
      isTopping: false,
      isShowTiming: false,
      currentItem: {},
      menuList: [
        {
          key: 0,
          name: "文本模式",
        },
        {
          key: 1,
          name: "大纲模式",
        },
      ],
    };
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home_note", this.note, "typeText", this.typeText);
    if (this.note && this.note.title) {
      store.dispatch("header/setIsEditedTitle", false);
    }
    window.addEventListener("keydown", () => {
      // let keyCode = e.keyCode;
      // if (keyCode === 13) {
      //   store.dispatch("header/setIsEditedTitle", false);
      // }
    });
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
  },
  mounted() {},
  methods: {
    switchMode() {
      const note = this.note;
      note.modeType = note.modeType === 1 ? 2 : 1;
      store.dispatch("header/setNote", note);
    },
    changeMenu(number: number) {
      console.log("选择类型", number);
      ipcRenderer.invoke("newWindow", { modeType: number });
      // switch (number) {
      //   case 0:
      //     break;
      //   default:
      //     break;
      // }
    },
    showToolBarFn() {
      store.dispatch("note/setShowToolBar", !this.showToolBar);
    },
    toHome() {
      this.$router.push("/");
    },
    zoomInAndOut() {
      const note = this.note;
      note.isZoomInAndOut = !note.isZoomInAndOut;
      store.dispatch("header/setNote", note);
      ipcRenderer.send("zoomInAndOut");
    },
    showTiming(type: number) {
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
      const typeText = this.typeText;
      if (typeText != "") {
        this.$emit("close");
        return;
      }
      let { note } = this;
      if (pageTypeText === "edited" || pageTypeText === "outline") {
        store.dispatch("header/setHeaderClose", false);
        store.dispatch("header/setNote", note);
      } else {
        await ipcRenderer.send("closeWindow", note._id);
      }
    },

    addNote(e: any) {
      this.X = e.clientX;
      this.Y = e.clientY;
      this.showMenu = !this.showMenu;
    },
    toSet() {
      this.$router.push("/set");
    },
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
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
    width: 100%;
    align-items: center;
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
  .right {
    width: 25%;
  }
  .title {
    width: 68% !important;
    text-align: center !important;
  }
  .left {
    width: 25%;
    line-height: 10px;
    cursor: pointer;
    .el-icon {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.home {
  .iconfont {
    @include iconfont(25px);
  }
}

.header_main {
  // width: 350px;
  display: flex;
  justify-content: space-between;
  padding: 8px 0px;
  text-align: center;
  align-items: center;
  div {
    // width: 20%;
  }
  .left {
    text-align: left;
    margin-left: 5px;
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
      width: 19px;
      cursor: pointer;
      opacity: 0.8;
    }
    i {
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>