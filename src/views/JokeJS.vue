<script setup lang="ts">
import { apiService, isApiError } from '@/services/api.service'
const { getData } = apiService()

const getJoke = async () => {
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

	return data.joke;
};

</script>
