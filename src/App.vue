<template>
  <Header></Header>
  <transition name="main-fade">
    <router-view></router-view>
  </transition>
</template>

<script>
import Header from "@/components/header";
export default {
  name: "App",
  components: { Header },
  created() {
    console.log("created", window.electronAPI.setTitle("1111111"));
  },
};
</script>

<style>
@keyframes main-fade {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
html {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
