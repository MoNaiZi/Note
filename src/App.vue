<template>
  <div :class="{ dark: user.dark }">
    <Header v-if="pageTypeText != 'menu'"></Header>
    <transition name="main-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "@/components/header";
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
import { store } from "@/store";
export default {
  name: "App",
  components: { Header },
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
    }),
    ...mapState("user", {
      user: (state) => state.user,
    }),
  },
  created() {
    console.log("created", this.$router);
    ipcRenderer.invoke("getUser").then((config) => {
      if (config) {
        store.dispatch("user/setUser", config);
      }
    });
  },
  mounted() {
    console.log("AppMounted");
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" src="@/assets/main.scss"></style>
<style lang="scss">
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

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  /**/
}
.father::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #333;
}
::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
