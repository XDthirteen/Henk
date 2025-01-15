<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <h1 class="title">My account</h1>
    <div class="user-options">
        <button @click="router.push({ name: 'settings' })">User Settings</button>
        <button @click="router.push({ name: 'parameters' })">Parameters</button>
    </div>

    <RouterView />
</template>

<style scoped>
.user-options {
    display: flex;
    gap: 0.5rem;
}
</style>