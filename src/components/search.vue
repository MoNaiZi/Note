<template>
  <div class="search-box">
    <div class="search flex-items">
      <div class="search-input flex1">
        <input
          v-model="searchWord"
          type="text"
          placeholder="搜索..."
          @input="searchDb"
        />
      </div>
      <button class="search-button" @click="searchDb">
        <i class="iconfont icon-search"></i>
      </button>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.search-box {
  padding: 0 12px;
  padding-top: 10px;
  box-sizing: border-box;
  background: #fff;
  padding-bottom: 10px;
}
.search {
  background-color: #f2f2f2;
  height: 34px;
  opacity: 0.9;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  .search-input {
    input {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      font-size: 14px;
      padding: 0 18px;
    }
  }
  .search-button {
    display: block;
    border: none;
    width: 36px;
    height: 100%;
    padding: 0;
    background-color: transparent;
    .iconfont {
      font-size: 20px;
    }
    &:hover {
      background-color: #e0e0e0;
    }
  }
  &:hover {
    opacity: 1;
  }
  &:active {
    opacity: 1;
  }
}
</style>
