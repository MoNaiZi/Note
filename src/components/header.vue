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
    <div class="title" v-show="pageTypeText === 'home'">便利贴</div>
    <div class="input_title" v-show="pageTypeText === 'edited'">
      <input placeholder="请输入标题" />
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
export default {
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
      winId: (state) => state.winId,
    }),
  },
  data() {
    return {};
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home", this.$router);
  },
  methods: {
    close() {
      console.log("winId", this.winId);
      window.electronAPI.closeWindow(this.winId);
    },
    addNote() {
      window.electronAPI.newWindow();
    },
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