<script setup lang="ts">
import { useAuth } from '@/services/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const { logout } = useAuth();

</script>

<template>
  <main>
    <div class="home-header">This is the HomeView.vue</div>
    <button @click="logout(), router.push({ name: 'login' })">Logout</button>
  </main>
</template>


<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  color: white;
  background-color: blue;
  border-radius: 5%;
  padding: 0.2rem 1rem 0.2rem 1rem;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  margin: 5px;
  border: 2px solid blue
}

button:hover {
  color: blue;
  background-color: white;
  border: 2px solid blue;
}
</style>
