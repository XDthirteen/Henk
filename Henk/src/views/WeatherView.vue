<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';


interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

export default defineComponent({
  name: 'WeatherApp',
  setup() {
    const city = ref<string>('');
    const weather = ref<WeatherData | null>(null);
    const error = ref<string | null>(null);

    const getWeather = async () => {
      if (!city.value) {
        error.value = "Please enter a city name.";
        weather.value = null;
        return;
      }

      const apiKey = "59f5d73944c323b9071de991b104300b"; // OpenWeatherMap API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}`;

      try {
        const response = await axios.get<WeatherData>(url);
        weather.value = response.data;
        error.value = null;
      } catch  {
        weather.value = null;
        error.value = "City not found. Please try again.";
      }
    };

    return {
      city,
      weather,
      error,
      getWeather,
    };
  },
});
</script>

<template>
  <div id="app">
    <h1>Weatherman Henk</h1>
    <div class="search">
      <input
        v-model="city"
        type="text"
        placeholder="Enter city name"
        @keyup.enter="getWeather"
      />
      <button @click="getWeather">Search</button>
    </div>
    <div v-if="weather" class="weather">
      <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
      <p>{{ weather.weather[0].description }}</p>
      <p>Temperature: {{ weather.main.temp }}°C</p>
      <p>Humidity: {{ weather.main.humidity }}%</p>
      <p>Wind Speed: {{ weather.wind.speed }} m/s</p>
    </div>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

.search {
  margin-bottom: 20px;
}

.search input {
  padding: 10px;
  font-size: 16px;
  width: 200px;
}

.search button {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.weather {
  margin-top: 20px;
  font-size: 18px;
}

.error {
  margin-top: 20px;
  color: red;
}
</style>
