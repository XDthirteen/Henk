<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <div class="wrapper">
        <div><img src="/images/logohenkFinal.png" alt="Henk" width="200"></div>
        <div class="btn-container">
            <button class="btn main-login" @click="router.push({ name: 'login' })">Login</button>
            <button class="btn first-line:main-register" @click="router.push({ name: 'signup' })">Sign up</button>
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

.btn-container {
    display: flex;
}

.btn {
    color: white;
    background-color: #453d83;
    border-radius: 10px;
    padding: 0.2rem 1rem 0.2rem 1rem;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    transition-duration: 0.4s;
    margin: 5px;
    border: 2px solid #453d83;
}

.btn:hover {
    color: #453d83;
    background-color: white;
    border: 2px solid #453d83
}
</style>
