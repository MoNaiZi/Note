<template>
  <div :class="['wrap', { isLeft }]">
    <transition name="main-fade">
      <div
        class="left_main"
        :style="{ width: leftWidth + 'px' }"
        v-show="isLeft"
      >
        <noteHeader
          key="editor_home"
          :typeText="'left'"
          :title="currentItem.title"
          :isLeft="isLeft"
          @close="openLeft"
        ></noteHeader>

        <edited
          v-if="!currentItem.modeType"
          ref="edited"
          key="home_index"
          :currentItem="currentItem"
          @onChange="changeEditor"
          :isLeft="isLeft"
          style="height: 90%; overflow-y: auto"
        />
        <outline
          v-else
          :isLeft="isLeft"
          :currentItem="currentItem"
          :setPageTypeText="'home'"
          @onChangeTree="onChangeTree"
        ></outline>
      </div>
    </transition>
    <div
      v-show="isLeft && isRight"
      @mousedown="splitLineDown"
      @mousemove="splitLineMove"
      @mouseup="splitLineUp"
      @mouseover="splitLineHover"
      @mouseout="splitLineHover"
      @pointerdown="beginSliding"
      @pointerup="stopSliding"
      @pointermove="splitLineMove"
      class="split_line"
    >
      <right-c
        v-show="isCollapsed"
        class="item"
        theme="outline"
        size="23"
        fill="#797979"
      />
    </div>
    <left-c
      v-show="isExpand"
      @click="openRight"
      class="left_c"
      theme="outline"
      size="24"
      fill="#797979"
    />
    <transition name="main-fade">
      <div
        class="right_main"
        v-show="isRight"
        :style="{ width: rightWidth + 'px' }"
      >
        <noteHeader></noteHeader>
        <router-view
          @openLeft="openLeft"
          :isLeft="isLeft"
          :leftItem="!isLeft ? currentItem : {}"
          :upCurrentItem="upCurrentItem"
          @close="openLeft"
        >
        </router-view>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { store } from "@/store";

import noteHeader from "@/components/note_header.vue";
import outline from "./outline.vue";
import edited from "./edited.vue";
import { defineComponent } from "vue";
import { RightC, LeftC } from "@icon-park/vue-next";
interface CurrentItem {
  _id: string | undefined | null;
  html: string | undefined | null;
  title: string | undefined;
  modeType: number | undefined;
  tree: object | undefined | null;
}
export default defineComponent({
  components: {
    noteHeader,
    outline,
    edited,
    RightC,
    LeftC,
  },
  computed: {
    ...mapState("header", {
      pageTypeText: (state: any) => state.pageTypeText,
      note: (state: any) => state.note || {},
      isEditedTitle: (state: any) => state.isEditedTitle,
    }),
  },
  data() {
    return {
      isTopping: false,
      isShowTiming: false,
      isLeft: false,
      currentItem: {} as CurrentItem,
      upCurrentItem: {} as CurrentItem,
      isSplitLineMove: false,
      leftWidth: 478 as number,
      rightWidth: 340 as number,
      isCollapsed: false,
      isExpand: false,
      isRight: true,
    };
  },
  watch: {
    pageTypeText: function (val) {
      this.$nextTick(() => {
        if (val != "home") {
          const wrap = document.querySelector(".wrap") as HTMLDivElement;
          if (wrap) {
            this.rightWidth = wrap.clientWidth;
          }
        }
      });
    },
    isLeft: function (val) {
      if (val) {
        this.rightWidth = 208;
        return;
      }
      window.removeEventListener("mousemove", () => {});
      this.rightWidth = 340;
      this.isRight = true;
    },
  },
  provide: {
    // homeCurrentItem: this.currentItem,
  },
  created() {
    const that = this;
    if (that.note && that.note.title) {
      store.dispatch("header/setIsEditedTitle", false);
    }

    window.addEventListener("keydown", (e) => {
      let currentTarget: any = e.target;
      let keyCode = e.keyCode;
      // console.log("keyCode home", keyCode);
      if (
        keyCode === 13 &&
        currentTarget == document.activeElement &&
        currentTarget.value.length
      ) {
        store.dispatch("header/setIsEditedTitle", false);
      }
    });

    window.addEventListener(
      "resize",
      this.debounce(() => {
        //你的代码块
        const wrap = document.querySelector(".wrap") as HTMLDivElement;
        let { rightWidth, isRight, isLeft } = that;
        const clientWidth = wrap.clientWidth;
        if (isLeft) {
          let width = clientWidth - rightWidth;
          if (!isRight) {
            width = clientWidth;
          }
          that.leftWidth = width;
        } else {
          that.rightWidth = clientWidth;
        }
      }, 0)
    );

    window.addEventListener("mousemove", (e) => {
      if (this.isLeft && !this.isRight) {
        console.log("鼠标移动", e);
        if (e.clientX + 10 > that.leftWidth) {
          that.isExpand = true;
        } else {
          that.isExpand = false;
        }
      }
    });
  },
  mounted() {},
  methods: {
    openRight() {
      this.isRight = true;
      this.isExpand = false;
      this.isSplitLineMove = false;
      this.leftWidth = this.leftWidth - this.rightWidth;
    },
    splitLineHover() {
      this.isCollapsed = !this.isCollapsed;
    },
    debounce(fn: () => void, delay: number) {
      let time: number = 0;
      let timer: any = null;
      let newTime = null;
      function task() {
        newTime = +new Date();
        if (newTime - time < delay) {
          timer = setTimeout(task, delay);
        } else {
          fn();
          timer = null;
        }
        time = newTime;
      }
      return function () {
        // 更新时间戳
        time = +new Date();
        if (!timer) {
          timer = setTimeout(task, delay);
        }
      };
    },
    stopSliding(e: any) {
      this.isSplitLineMove = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    beginSliding(e: any) {
      console.log(e.target.nodeName);
      if (e.target.nodeName === "svg" || e.target.nodeName === "path") {
        this.isRight = !this.isRight;
        if (this.isRight) {
          this.leftWidth = this.leftWidth - this.rightWidth;
        } else {
          this.leftWidth = this.leftWidth + this.rightWidth;
        }
      } else {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    },
    getDom() {
      this.$nextTick(() => {
        const isRight = this.isRight;
        const left_main: any = document.querySelector(".left_main");
        if (left_main) this.leftWidth = left_main.clientWidth;
        const right_main: any = document.querySelector(".right_main");
        if (right_main && isRight) this.rightWidth = right_main.clientWidth;
      });
    },
    splitLineUp() {
      this.isSplitLineMove = false;
    },
    splitLineDown() {
      this.getDom();
      this.isSplitLineMove = true;
    },
    splitLineMove(e: any) {
      const isSplitLineMove = this.isSplitLineMove;
      if (!isSplitLineMove) return;
      const offsetX = e.offsetX;
      const rightWidth: any = this.rightWidth;
      const leftWidth: any = this.leftWidth;
      const isRight = this.isRight;
      if (offsetX > 0) {
        //右
        let result = rightWidth - offsetX;
        if (result < 200) return;
        if (isRight) this.rightWidth = result;

        this.leftWidth = leftWidth + Math.abs(offsetX);
      } else {
        // 左
        let result = leftWidth + offsetX;
        if (result < 200) return;
        this.leftWidth = result;
        if (isRight) this.rightWidth = rightWidth + Math.abs(offsetX);
      }
    },
    onChangeTree(tree: any) {
      this.currentItem.tree = tree;
    },
    changeEditor({ html }: { html: string; _id: string }) {
      // console.log("html", html);
      this.currentItem.html = html;
    },
    openLeft(item: any, bool = null) {
      // console.log("打开右侧", bool, item);
      if (!item) {
        this.isLeft = false;

        this.$nextTick(() => {
          this.currentItem = {
            _id: null,
            html: null,
            title: "",
            modeType: undefined,
            tree: undefined,
          };
          this.upCurrentItem = JSON.parse(JSON.stringify(this.currentItem));
        });

        return;
      }

      item = JSON.parse(JSON.stringify(item));
      if (item && item._id != this.currentItem._id) {
        this.isLeft = true;
        this.upCurrentItem = JSON.parse(JSON.stringify(this.currentItem));
      } else {
        this.isLeft = false;
      }
      if (bool != null && typeof bool != "undefined") {
        this.isLeft = bool;
      }

      if (this.isLeft) {
        this.currentItem = item;
        store.dispatch("header/setNote", item || {});
      } else {
        this.$nextTick(() => {
          this.currentItem = {
            _id: null,
            html: null,
            title: "",
            modeType: undefined,
            tree: undefined,
          };
          this.upCurrentItem = JSON.parse(JSON.stringify(this.currentItem));
        });
      }
    },
  },
});
</script>

<style>
</style>
<style lang="scss" scoped>
.left_c :deep(svg path) {
  fill: #fff;
}
.split_line :deep(svg path) {
  fill: #fff;
}
.left_c {
  position: absolute;
  right: -9px;
  top: 50%;
  cursor: pointer;
}
.split_line {
  border-left: 3px dashed #d0d0d0;
  margin-left: -5px;
  cursor: col-resize;
  z-index: 100;
  .item {
    position: relative;
    top: 50px;
    left: -14px;
    z-index: 110;
    cursor: pointer;
  }
}
.wrap {
  position: relative;
  display: flex;
  background: #fff;
  border-radius: 10px;
  height: 100%;
  margin: 5px;
  overflow: hidden;
  box-shadow: 0 0 6px #9e9e9e;
  text-align: center;

  .left_main {
    height: 100vh;
    // width: 350px;

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