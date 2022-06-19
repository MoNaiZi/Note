<template>
  <Search></Search>
  <div class="list">
    <div v-for="item in 20" :key="item" class="item"></div>
  </div>
</template>

<script>
import Search from "@/components/search.vue";
export default {
  components: {
    Search,
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 10px;
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
.list {
  height: 83vh;
  overflow: auto;

  .item {
    width: 93%;
    height: 67px;
    padding: -4px;
    box-shadow: 0 0 4px #cbcbcb;
    cursor: pointer;
    margin: 10px auto;
    border-radius: 5px;
  }
  .item:hover {
    box-shadow: 0 0 4px #9c9c9c;
  }
}
</style>
