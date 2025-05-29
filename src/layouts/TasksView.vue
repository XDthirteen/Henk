<script setup lang="ts">
import StyledButton from '@/components/StyledButton.vue';
import router from '@/router';
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue';

</script>

<template>
  <ModuleTitleContainer>My tasks</ModuleTitleContainer>
  <div class="button-container">
    <StyledButton type="primary" @click="router.push({ name: 'todo_tasks' })">Tasks to do</StyledButton>
    <StyledButton type="primary" @click="router.push({ name: 'done_tasks' })">Done tasks</StyledButton>
  </div>
  <RouterView />
</template>

<style scoped>
.button-container {
  margin: 0 2rem 0 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0.5rem;
}
</style>
