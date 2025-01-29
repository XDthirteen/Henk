<script setup lang="ts">
import { useRouter } from 'vue-router';
import StyledButton from '@/components/StyledButton.vue';

const router = useRouter();

</script>

<template>
  <div class="view-title">My account</div>
  <div class="button-container">
    <StyledButton type="primary" @click="router.push({ name: 'settings' })">User Settings</StyledButton>
    <StyledButton type="primary" @click="router.push({ name: 'parameters' })">Parameters</StyledButton>
  </div>


  <RouterView />
</template>

<style scoped>
.view-title {
  border: 2px solid var(--primary-purple);
  border-radius: 10px;
  background-color: var(--secundary-purple);
  margin: 1rem 2rem 1rem 2rem;
  padding: 0.5rem;
  text-align: center;
  font-size: x-large;
  font-weight: 500;
}

.button-container {
  margin: 0 2rem 0 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
}
</style>
