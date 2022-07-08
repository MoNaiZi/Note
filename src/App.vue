<template>
  <div :class="classFn">
    <!-- <transition>
      <template v-if="['home', 'edited', 'set'].includes(pageTypeText)">
        <component :is="'Header'"></component>
      </template>
    </transition> -->
    <!-- <transition name="main-fade"> -->
    <router-view> </router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
import { store } from "@/store";
export default {
  name: "App",
  // components: { Header },
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
    }),
    ...mapState("user", {
      user: (state) => state.user,
    }),
    classFn() {
      const user = this.user;
      const pageTypeText = this.pageTypeText;
      if (pageTypeText === "menu") return;
      return { dark: user.dark };
    },
  },
  created() {
    console.log("created", this.$router);
    ipcRenderer.on("sendUser", (event, res) => {
      this.setConfig(res.config);
    });
    ipcRenderer.invoke("getUser").then((res) => {
      this.setConfig(res);
    });
  },
  methods: {
    setConfig(config) {
      if (config) {
        store.dispatch("user/setUser", config);
      }
    },
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
