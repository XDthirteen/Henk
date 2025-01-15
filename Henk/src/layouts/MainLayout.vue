<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <div>
    MainLayout.vue
    <button @click="router.push({ name: 'myAccount' })">Go to My account</button>
    <RouterView />
  </div>
</template>


<style scoped></style>
