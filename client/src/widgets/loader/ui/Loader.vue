<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <div v-if="show" class="loader-overlay">
    <div class="loader">
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss">
* {
  transition: all 0.2s, opacity 0.02s;
}

.loader-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f15f79;
  animation: grader 1s linear infinite;
}

.loader {
  width: 100px;
  height: 100px;
}

.loader span {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: #fff;
  animation: loader 1.5s linear infinite;
}

.loader span:last-child {
  animation-delay: -0.9s;
  -webkit-animation-delay: -0.9s;
}

@keyframes loader {
  from {
    transform: scale(0, 0);
    opacity: 0.8;
  }
  to {
    transform: scale(1, 1);
    opacity: 0;
  }
}

@keyframes grader {
  from {
    background: #f15f79;
  }
  to {
    background: #fff;
  }
}

@keyframes dark-grader {
  from {
    background: #f15f79;
  }
  to {
    background: #101111;
  }
}

@keyframes nord-grader {
  from {
    background: #f15f79;
  }
  to {
    background: #3b4252;
  }
}

// .loader-overlay {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: fixed;
//   z-index: 2;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: #f15f79;
//   animation: grader 1s linear infinite;

//   &__loader {
//     width: 100px;
//     height: 100px;


//   }

//   &__loader span {
//     position: absolute;
//     width: 100px;
//     height: 100px;
//     border-radius: 100%;
//     background: #fff;
//     animation: loader 1.5s linear infinite;
//   }

//   &__loader span:last-child {
//     animation-delay: -0.9s;
//     -webkit-animation-delay: -0.9s;
//   }
// }
</style>
