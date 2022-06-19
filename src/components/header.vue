<template>
  <div class="main">
    <div class="left">
      <i class="iconfont icon-add"></i>
    </div>
    <div class="title">便利贴</div>
    <div class="right">
      <!-- <i class="iconfont">最小化</i> -->
      <i class="iconfont icon-setting" @click="this.$router.push('/set')"></i>
      <i class="iconfont icon-close"></i>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    // this.$router.psuh('/set')
    console.log("this", this.$router.push);
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
    width: 33%;
  }
  .left {
    text-align: left;
  }
  .title {
    -webkit-app-region: drag;
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