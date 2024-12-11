<script lang="ts" setup>
import axios from 'axios';
import { ref, type Ref } from 'vue';

const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

const isAuthenticated = ref(localStorage.getItem("token") !== null);

const login = async (email: string, password: string) => {
    try {
        const response = await axios.post<{token: string}>("/api/auth/login", {
            email: email,
            password: password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        isAuthenticated.value = true;
    } catch (error) {
        throw new Error(`Login wrong. Error: ${error}`);
    }
}

const authenticate = async() => {
    try {
        await login(inputUsername.value, inputPassword.value)
        console.log('Succesfull authenticated')
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div>This is the Login view</div>
    <div class="login-container">
        <input id = "login-username" class="login" type="email" placeholder="example@example.com" v-model="inputUsername">
        <input id = "login-password" class="login" type="password" placeholder="Your password" v-model="inputPassword">
        <button id="login-btn" @click="authenticate()">Login</button>
    </div>
</template>

<style scoped>
.login-container{
    display: flex;
    flex-direction: column;
    max-width: 12rem;
}
</style>