<script setup lang="ts">
import StyledButton from '@/components/StyledButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="wrapper">
    <div><img src="/images/logohenkFinal.png" alt="Henk" width="200"></div>
    <div>
      <StyledButton type="primary" @click="router.push({ name: 'login' })">
        Login
      </StyledButton>
      <StyledButton type="primary" @click="router.push({ name: 'signup' })">
        Sign up
      </StyledButton>
    </div>
    <RouterView />
  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
