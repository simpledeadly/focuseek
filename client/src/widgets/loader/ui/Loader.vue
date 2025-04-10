<template>
  <div class="loader-overlay">
    <div class="loader">
      <!-- <h1>хэй а я загружаюся :)</h1> -->
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  transition:
    all 0.2s,
    opacity 0.02s;
}

.light .loader-overlay {
  animation: light-grader 1s linear infinite;

  .loader span {
    position: absolute;
    width: 100px;
    height: 100px;
    background: #010101;
    border-radius: 100%;
    animation: loader 1.5s linear infinite;
  }
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  // animation: grader 1s linear infinite;
  animation: dark-grader 1s linear infinite;
}

.loader {
  width: 100px;
  height: 100px;
}

.loader span {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 100%;
  animation: loader 1.5s linear infinite;
}

.loader span:last-child {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@keyframes loader {
  from {
    opacity: 0.8;
    transform: scale(0, 0);
  }
  to {
    opacity: 0;
    transform: scale(1, 1);
  }
}

@keyframes light-grader {
  from {
    background: #fff;
  }
  to {
    background: #fff;
  }
}

@keyframes dark-grader {
  from {
    background: #09090b;
  }
  to {
    background: #09090b;
  }
}
</style>
