2<template>
  <el-icon color="#fff" class="icon">
    <BellFilled />
  </el-icon>
  <div class="box">
    <div class="object">
      <div class="outline"></div>
      <div class="outline" id="delayed"></div>
      <div class="button"></div>
      <div class="button" id="circlein"></div>
    </div>
  </div>
</template>

<style scoped>
.icon {
  position: absolute;
  font-size: 26px;
  z-index: 10;
  left: 12px;
  top: 10px;
}
.box {
  transform: scale(0.3);
  position: absolute;
  top: 50%;
  left: 50%;
}

.object {
  display: flex;
  flex: 0 1 100%;
  justify-content: center;
  align-items: center;
  align-content: stretch;
}

.outline {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 100px solid #B5A44;
  animation: pulse 3s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
  position: absolute;
}

.button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0a227;
  box-shadow: 0px 0px 80px #fff3e1;
  position: absolute;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 0;
    border: 65px solid #fff3e1;
  }
  50% {
    border: solid #f9e1be;
    opacity: 0.8;
  }

  90% {
    transform: scale(3.2);
    opacity: 0.2;
    border: 3px solid #fff3e1;
  }
  100% {
    transform: scale(3.3);
    opacity: 0;
    border: 1px solid #f9e1be;
  }
}

#delayed {
  animation-delay: 1.5s;
}

#circlein {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0a227;
  box-shadow: 0px -2px 15px #f9e1be;
  position: absolute;
}

.mic-icon {
  height: 60px;
  position: absolute;
  margin: 21px;
}
</style>