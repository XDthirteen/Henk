<script setup lang="ts">
import { apiService, isApiError } from '@/services/api.service'
import StyledButton from '@/components/StyledButton.vue';
import { onMounted, ref } from 'vue';
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue';

const getJoke = ref('')
const loading = ref(false)
const error = ref(false)

const { getData } = apiService()

const fetchJoke = async () => {
	const data = await getData('https://icanhazdadjoke.com/', {
		headers: {
			Accept: 'application/json',
		},
	});

	if (isApiError(data)) {
    // if an error occures, you get the error status (null if no status) (status is number eg: 400, 402, 404 etc)
    // a generic message comes for every error (message is always string)
    // if you want a specific message to show the user per action, per status you can overwrite the message (eg: at login status 400 means wrong username or password)

    // use error popup component when finished
		console.error(`${data.status} ${data.message}`);
		return;
	};

	getJoke.value =  data.joke;
};
onMounted(fetchJoke)

</script>


<template>
  <div>
    <div class="text-color">
      <ModuleTitleContainer>Dad Joke</ModuleTitleContainer>
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">Failed to fetch a joke.</p>
      <p v-else>{{ getJoke }}</p>
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
