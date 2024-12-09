<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <div>hello world</div>
    <button @click="router.push({ name: 'login' })">Login</button>
    <RouterView/>
</template>