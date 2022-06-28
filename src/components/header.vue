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
      <div v-if="!isEditedTitle" @dblclick="this.isEditedTitle = true" class="">
        {{ note.title }}
      </div>
      <input v-else v-model="note.title" placeholder="请输入标题" />
    </div>
    <div class="right">
      <i v-show="pageTypeText === 'edited'" class="iconfont icon-thepin"></i>
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
      note: (state) => state.note,
    }),
  },
  watch: {
    // note: {
    //   deep: true,
    //   handler: function (note) {
    //     if (note.title) {
    //       this.isEditedTitle = false;
    //     }
    //   },
    // },
  },
  data() {
    return {
      isEditedTitle: true,
    };
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home", this.$router);
    let watchNote = null;
    watchNote = this.$watch(
      "note",
      (note) => {
        console.log("note", note, watchNote);
        if (note.title) {
          this.isEditedTitle = false;
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
      console.log("keyCode", keyCode);
      if (keyCode === 13) {
        this.isEditedTitle = false;
      }
    });
  },
  methods: {
    close() {
      const pageTypeText = this.pageTypeText;
      let { note } = this;
      if (pageTypeText === "edited") {
        store.dispatch("header/setNote", note);
      }
      ipcRenderer.send("closeWindow", note._id);
    },
    addNote() {},
    toSet() {
      this.$router.push("/set");
    },
  },
};
</script>

<style lang="scss" scoped>
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
    -webkit-app-region: drag;
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
    -webkit-app-region: drag;
    width: 60%;
  }

  .right {
    text-align: right;
    i {
      margin-left: 10px;
    }
  }
}
</style>