<script setup lang='ts'>
import { apiService, isApiError } from '@/services/api.service';
import ErrorPopup from '@/components/popups/ErrorPopup.vue';
import StyledButton from '@/components/StyledButton.vue';
import { onMounted, ref } from 'vue';
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue';

const showErrorPopup = ref(false);
const errorMessage = ref<string>('');
const errorStatus = ref<number | null>(null);
const errorExplanation = ref<string>('');

const getJoke = ref('');
const loading = ref(false);
const error = ref(false);

const { getData } = apiService();

const fetchJoke = async () => {
  const data = await getData('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (isApiError(data)) {
    errorStatus.value = data.status;
    errorMessage.value = data.message;
    errorExplanation.value = 'Unable to get a joke.';
    showErrorPopup.value = true;
    return;
  };

  getJoke.value = data.joke;
};

onMounted(fetchJoke);
</script>

<template>
  <ModuleTitleContainer>Dad Joke</ModuleTitleContainer>
  <div class="joke-container">
    <div class="joke-display">
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">Failed to fetch a joke.</p>
      <p v-else>{{ getJoke }}</p>
    </div>
    <StyledButton type="primary" @click="fetchJoke">New Joke</StyledButton>
  </div>

  <ErrorPopup
    v-if="showErrorPopup"
    :errorExplanation="errorExplanation"
    :errorStatus="errorStatus"
    :errorMessage="errorMessage"
    @close="showErrorPopup = false"
  />
</template>

<style scoped>
.joke-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 5rem;
  margin-right: 5rem;
}

.joke-display {
  margin-bottom: 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--purple-text);
  font-size: x-large;
}
</style>
