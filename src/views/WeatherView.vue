<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import type { WeatherData, ForecastData } from '@/components/models';
import { getWeather } from '@/services/weather.service';

export default defineComponent({
  name: 'WeatherApp',
  setup() {
    const city = ref<string>('');
    const weather = ref<WeatherData | null>(null);
    const forecast = ref<ForecastData[]>([]);
    const error = ref<string | null>(null);

    const getWeather = async () => {
      if (!city.value) {
        error.value = "Please enter a city name.";
        weather.value = null;
        forecast.value = [];
        return;
      }

      const apiKey = "59f5d73944c323b9071de991b104300b"; // OpenWeatherMap API key
      const weatherBaseUrl = `https://api.openweathermap.org/data/2.5/` // BaseUrl API
      const weatherUrl = `${weatherBaseUrl}weather?q=${city.value}&units=metric&appid=${apiKey}`;
      const forecastUrl = `${weatherBaseUrl}forecast?q=${city.value}&units=metric&appid=${apiKey}`;


      try {
        const weatherResponse = await axios.get<WeatherData>(weatherUrl);
        weather.value = weatherResponse.data;
        const forecastResponse = await axios.get<{list:ForecastData[]}>(forecastUrl);
        forecast.value = forecastResponse.data.list.filter((item)=>
        item.dt_txt.includes("12:00:00")
    ).slice(0, 4);

        error.value = null;
      } catch  {
        weather.value = null;
        forecast.value = [];
        error.value = "City not found. Please try again.";
      }
    };

    return {
      city,
      weather,
      forecast,
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
      <p class="description">{{ weather.weather[0].description }}</p>
      <p class="temperature">Temperature: <strong>{{ weather.main.temp }}°C</strong></p>
      <p>Humidity: {{ weather.main.humidity }}%</p>
      <p>Wind Speed: {{ weather.wind.speed }}m/s</p>
    </div>

    <div v-if="forecast.length > 0" class="forecast">
      <h3>Future 4 days</h3>
      <div class="forecast-item" v-for="(item, index) in forecast" :key="index">
        <p><strong>{{ item.dt_txt }}</strong></p>
        <p class="description">{{ item.weather[0].description }}</p>
        <p class="temperature">Temperature: <strong>{{ item.main.temp }}°C</strong></p>
        <p>Humidity: {{ item.main.humidity }}%</p>
        <p>Wind Speed: {{ item.wind.speed }}m/s</p>
      </div>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search {
  margin-bottom: 20px;
}

.search input {
  padding: 10px;
  font-size: 16px;
  width: 200px;
  border: 2px solid #453d83;
  border-radius: 2%;
}

.search button {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background-color: #453d83;
  border-radius: 2%;
  margin-left: 5px;
  border: 2px solid #453d83;
  color: white;
  transition-duration: 0.4s;
}

.search button:hover {
  background-color: white;
  border: 2px solid #453d83;
  color: #453d83;
}

h1{
    font-weight: bolder;
    font-size: xx-large;
    margin-bottom: 10px;
    color: #453d83;
  }
  h2{
    font-weight: bold;
    color: #453d83;
  }

  h3{
    font-weight: bold;
    font-size: large;
    color: #453d83;
    display: flex;
    width: 100%;
    justify-content: center;
  }

.weather {
  margin-top: 20px;
  padding: 25px;
  width: 30%;
  max-width: 300px;
  min-width: 250px;
  height: auto;
  max-height: 250px;
  font-size: 18px;
  background-color: #e9f3fe;
  border-radius: 2%;
  text-align: center;
}

.error {
  margin-top: 20px;
  color: red;
  font-weight: bolder;
  font-size: x-large;
}

.description{
  font-style: italic;
}

.forecast{
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 10px;
  background-color: #e9f3fe;
  border-radius: 2%;
}

.forecast-item{
  flex: 1 1 calc(25% - 20px);
  max-width: 200px;
  text-align: center;
  margin: 10px;
  background-color: white;
  border-radius: 2%;
  padding: 10px;
}

strong{
  font-weight: bold;
}

</style>
