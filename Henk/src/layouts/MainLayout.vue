<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <div>This is the main layout</div>
    <button @click="router.push({ name: 'login' })">Go to login</button>
    <button @click="router.push({ name: 'myAccount' })">Go to My account</button>
    <RouterView />
</template>