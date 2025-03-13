<script setup lang="ts">
import { ref } from "vue";
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";

const completed = ref(false);
const icon1 = 'check-circle';
const icon2 = 'circle-notch';

const toggleCompleted = () => {
  completed.value = !completed.value;
  console.log(completed.value)
};
</script>

<template>
  <div>
    <transition name="scale" mode="out-in">
      <FontAwesomeIconToggler :key="completed ? 'icon2' : 'icon1'" :iconToggler="completed" :icon1="icon1"
        :icon2="icon2" @toggle="toggleCompleted" />
    </transition>
  </div>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease-in-out;
}

.scale-enter,
.scale-leave-to {
  transform: scale(0.5);
}
</style>
