2<template>
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
  background: #50cddd;
  box-shadow: 0px 0px 80px #0084f9;
  position: absolute;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 0;
    border: 65px solid #0b3082;
  }
  50% {
    border: solid #a3ffc2;
    opacity: 0.8;
  }

  90% {
    transform: scale(3.2);
    opacity: 0.2;
    border: 3px solid #2e3cff;
  }
  100% {
    transform: scale(3.3);
    opacity: 0;
    border: 1px solid #7a89ff;
  }
}

#delayed {
  animation-delay: 1.5s;
}

#circlein {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #6bd6e1;
  box-shadow: 0px -2px 15px #e0ff94;
  position: absolute;
}

.mic-icon {
  height: 60px;
  position: absolute;
  margin: 21px;
}
</style>