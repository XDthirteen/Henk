<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <div class="wrapper">
    <div><img src="/images/logohenkFinal.png" alt="Henk" width="200"></div>
    <button class="main-login" @click="router.push({ name: 'login' })">Go to login</button>
    <button @click="router.push({ name: 'myAccount' })">Go to My account</button>
    <RouterView/>
  </div>
</template>


<style scoped>

.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-login{
    color: white;
    background-color: deeppink;
    border-radius: 5%;
    padding: 0.2rem 1rem 0.2rem 1rem;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    transition-duration: 0.4s;
    margin: 5px;
    border: 2px solid deeppink;
}
.main-login:hover{
    color: deeppink;
    background-color: white;
    border: 2px solid deeppink
}

</style>
