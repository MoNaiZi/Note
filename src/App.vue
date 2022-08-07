<template>
  <div :class="['app_wrap', classFn]" :style="[styleFn]">
    <!-- <transition>
      <template v-if="['home', 'edited', 'set'].includes(pageTypeText)">
        <component :is="'Header'"></component>
      </template>
    </transition> -->
    <transition name="main-fade">
      <router-view> </router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
import { store } from "@/store";
export default defineComponent({
  name: "App",
  // components: { Header },
  computed: {
    ...mapState("header", {
      pageTypeText: (state: any) => state.pageTypeText,
    }),
    ...mapState("user", {
      user: (state: any) => state.user,
    }),
    styleFn() {
      let result = { transition: "all 1s" };
      if (this.pageTypeText === "edited") {
        result.transition = "";
      }
      return result;
    },
    classFn() {
      type User = {
        dark: Boolean | undefined;
      };
      const user: User = this.user;
      const pageTypeText: string = this.pageTypeText;
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
    setConfig(config: Object) {
      if (config) {
        store.dispatch("user/setUser", config);
      }
    },
  },
  mounted() {
    console.log("AppMounted");
  },
});
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
  border-radius: 10px;
  height: 98vh;
  .app_wrap {
    height: 100%;
  }
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
