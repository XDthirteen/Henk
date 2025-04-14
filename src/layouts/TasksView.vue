<script setup lang="ts">
import StyledButton from '@/components/StyledButton.vue';
import router from '@/router';

</script>

<template>
  <div id="app">
    <h1>My tasks</h1>
  </div>
  <div class="button-container">
    <StyledButton type="primary" @click="router.push({ name: 'todo_tasks' })">Tasks to do</StyledButton>
    <StyledButton type="primary" @click="router.push({ name: 'done_tasks' })">Done tasks</StyledButton>
  </div>
  <RouterView />
</template>

<style scoped>
#app {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

h1 {
  font-weight: bolder;
  font-size: xx-large;
  margin-bottom: 10px;
  color: var(--primary-purple);
}

.button-container {
  margin: 0 2rem 0 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0.5rem;
}
</style>
