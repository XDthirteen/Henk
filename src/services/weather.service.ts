import axios from "axios";
import { ref } from "vue";
import type { WeatherData, ForecastData } from '@/components/models';


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
    }
  }
}
);
