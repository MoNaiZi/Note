<template>
  <div class="main">
    <div class="left">
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
    <div class="title">便利贴</div>
    <div class="right">
      <i v-show="pageTypeText === 'edited'" class="iconfont icon-thepin"></i>
      <i
        v-show="pageTypeText === 'home'"
        class="iconfont icon-setting"
        @click="toSet"
      ></i>

      <i class="iconfont icon-close"></i>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
    }),
  },
  data() {
    return {};
  },
  created() {
    // this.$router.psuh('/set')
    console.log("home", this.$store);
  },
  methods: {
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
  .iconfont {
    font-size: 25px;
    cursor: pointer;
  }
  .right {
    text-align: right;
    i {
      margin-left: 10px;
    }
  }
}
</style>