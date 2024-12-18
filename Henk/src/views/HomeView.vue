<script setup lang="ts">
import { useAuth } from '@/services/auth.service';
import TheWelcome from '../components/TheWelcome.vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const { logout } = useAuth();

</script>

<template>
  <main>
    <button @click="logout(), router.push({ name: 'login'})">Logout</button>
    <TheWelcome />
  </main>
</template>
