<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StyledButton from '@/components/StyledButton.vue';
import StyledInputByType from "@/components/StyledInputByType.vue";

const joke = ref('')
const loading = ref(false)
const error = ref(false)


async function fetchJoke() {
  loading.value = true
  error.value = false

  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    joke.value = data.joke
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchJoke)
</script>

<template>
  <div>
    <div class="text-color">
      <h1>Dad Joke Generator</h1>
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">Failed to fetch a joke.</p>
      <p v-else>{{ joke }}</p>
      <StyledButton @click="fetchJoke">New Joke</StyledButton>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
.text-color {
  color: aliceblue;
}

</style>
