<template>
  <Header v-if="pageTypeText != 'menu'"></Header>
  <transition name="main-fade">
    <router-view></router-view>
  </transition>
</template>

<script>
import Header from "@/components/header";
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
export default {
  name: "App",
  components: { Header },
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
    }),
  },
  created() {
    console.log("created", this.$router);
    const app = document.getElementById("app");
    ipcRenderer.invoke("theme").then((res) => {
      console.log("res", res);
      console.log("app", app);
    });
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
body {
  /* background: #333;
  color: white; */
}
/* ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
} */
.timing_date_picker {
  top: 20px !important;
}
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
