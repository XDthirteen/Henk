<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getWeather, getForecast } from '@/services/weather.service';
import type { WeatherData, ForecastData } from '@/components/models';
import StyledButton from '@/components/StyledButton.vue';
import StyledInputByType from '@/components/StyledInputByType.vue';
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { userSettings } from '@/services/userSettings.service';

const { getUserParam } = userSettings();

const city = ref<string>('');

onMounted(async () => {
  const param = await getUserParam()
  if (param?.city) {
    city.value = param.city
    fetchWeatherData()
  }
})

const weather = ref<WeatherData | null>(null);
const forecast = ref<ForecastData[]>([]);
const errorMessage = ref<string | null>(null);

const fetchWeatherData = async () => {
  if (!city.value) {
    errorMessage.value = 'Please enter a city name.';
    weather.value = null;
    forecast.value = [];
    return;
  }

  errorMessage.value = null;
  try {
    weather.value = await getWeather(city.value);

    const forecastData = await getForecast(city.value);
    forecast.value = Array.isArray(forecastData) ? forecastData : [];
  } catch (error: unknown) {
    const err = error as { response: { data: { message: string } } };

    if (err.response?.data?.message === 'city not found') {
      errorMessage.value = 'City was not found';
    } else {
      errorMessage.value = 'An unexpected error occurred';
    }
    weather.value = null;
    forecast.value = [];
  }
};

function getDayFromDate(aDateString: string): string {
  const aDate = new Date(aDateString)
  return `${aDate.toLocaleDateString('en-Latn-US', { weekday: 'short' })} ${aDate.getDate()}/${(aDate.getMonth() + 1) % 12}`
}
</script>

<template>
  <ModuleTitleContainer>Weatherman Henk</ModuleTitleContainer>
  <div id="app">
    <div class="search">
      <StyledInputByType v-model="city" type="text" placeholder="Enter city name" @keyup.enter="fetchWeatherData" />
      <StyledButton type="primary" @click="fetchWeatherData">Search</StyledButton>
    </div>

    <div v-if="weather" class="weather">
      <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
      <p class="description">{{ weather.weather[0].description }}</p>
      <p class="temperature">Temperature: <strong>{{ weather.main.temp }}°C</strong></p>
      <p>Humidity: {{ weather.main.humidity }}%</p>
      <p>Wind Speed: {{ weather.wind.speed }}m/s</p>
    </div>

    <div v-if="forecast.length > 0" class="forecast-border"></div>
    <div v-if="forecast.length > 0" class="forecast">
      <h3>Future 4 days</h3>
      <div class="forecast-item" v-for="(item, index) in forecast" :key="index">
        <p><strong>{{ getDayFromDate(item.dt_txt) }}</strong></p>
        <p class="description">{{ item.weather[0].description }}</p>
        <p class="temperature">Temperature: <strong>{{ item.main.temp }}°C</strong></p>
        <p>Humidity: {{ item.main.humidity }}%</p>
        <p>Wind Speed: {{ item.wind.speed }}m/s</p>
      </div>
    </div>
    <div v-if="errorMessage">
      <ErrorMessage>{{ errorMessage }}</ErrorMessage>
    </div>
  </div>
</template>

<style scoped>
#app {
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search {
  margin-bottom: 10px;
}

h2 {
  font-weight: bold;
  color: var(--purple-text);
}

h3 {
  font-weight: bold;
  font-size: large;
  color: var(--purple-text);
  display: flex;
  width: 100%;
  justify-content: center;
}

p {
  color: var(--black-text);
}

.weather {
  padding: 15px;
  width: 30%;
  max-width: 300px;
  min-width: 250px;
  height: auto;
  max-height: 250px;
  font-size: 18px;
  background-color: var(--second-background);
  border-radius: 2%;
  text-align: center;
}

.description {
  font-style: italic;
}

.forecast-border {
  width: 80%;
  height: 5px;
  background-color: var(--title-border);
  margin-top: 10px;
}

.forecast {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
}

.forecast-item {
  flex: 1 1 calc(25% - 20px);
  max-width: 200px;
  text-align: center;
  margin: 10px;
  background-color: var(--second-background);
  border-radius: 2%;
  padding: 10px;
}

strong {
  font-weight: bold;
}
</style>
