<template>
  <div :class="['wrap', { isLeft }]">
    <transition name="main-fade">
      <div class="left_main" v-show="isLeft">
        <noteHeader
          key="editor_home"
          :typeText="'left'"
          :title="currentItem.title"
          :isLeft="isLeft"
          @close="openLeft"
        ></noteHeader>

        <noteEditor
          v-if="!currentItem.modeType"
          ref="noteEditor"
          key="home_index"
          :currentItem="currentItem"
          @onChange="onChange"
          style="height: 90%; overflow-y: auto"
        />
        <outline
          v-else
          :currentItem="currentItem"
          :setPageTypeText="'home'"
          @onChangeTree="onChangeTree"
        ></outline>
      </div>
    </transition>

    <transition name="main-fade">
      <div class="right_main">
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
import noteEditor from "@/components/note_editor.vue";
import noteHeader from "@/components/note_header.vue";
import outline from "./outline.vue";
import { defineComponent } from "vue";

interface CurrentItem {
  _id: string | undefined | null;
  html: string | undefined | null;
  title: string | undefined;
  modeType: number | undefined;
  tree: object | undefined | null;
}
export default defineComponent({
  components: {
    noteEditor,
    noteHeader,
    outline,
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
    };
  },
  provide: {
    // homeCurrentItem: this.currentItem,
  },
  created() {
    // this.$router.psuh('/set')
    // console.log("home_note", this.note);
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
  },
  mounted() {},
  methods: {
    onChangeTree(tree: any) {
      this.currentItem.tree = tree;
    },
    onChange({ html }: { html: string; _id: string }) {
      this.currentItem.html = html;
    },
    changeEditor(editor: any) {
      // console.log("editor", editor);
      this.currentItem.html = editor.getHtml();
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

<style lang="scss" scoped>
.wrap {
  display: flex;
  background: #fff;
  border-radius: 10px;
  height: 100%;
  margin: 5px;
  box-shadow: 0 0 6px #9e9e9e;
  .right_main {
    width: 100%;
    // transition: all 0.5s;
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