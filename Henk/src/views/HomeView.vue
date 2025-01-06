<script setup lang="ts">
import { useAuth } from '@/services/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const { logout } = useAuth();

</script>

<template>
  <main>
    <div>This is the HomeView</div>
    <button @click="logout(), router.push({ name: 'login'})">Logout</button>
  </main>
</template>
