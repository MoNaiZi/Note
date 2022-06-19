<template>
  <Header></Header>
  <transition name="main-fade">
    <router-view></router-view>
  </transition>
  <!-- <router-view v-slot="{ Component }">
    <transition name="main-fade">
      <component :is="Component" />
    </transition>
  </router-view> -->
</template>

<script>
import Header from "@/components/header";
export default {
  name: "App",
  components: { Header },
  created() {
    console.log("created", this.$store);
  },
};
</script>

<style>
.main-fade-enter,
.main-fade-leave-to {
  display: none;
  opacity: 0;
  animation: main-fade 0.4s reverse;
}
.main-fade-enter-active,
.main-fade-leave-active {
  opacity: 0;
  animation: main-fade 0.4s;
}
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
