import axios from "axios";
import type { WeatherData, ForecastData } from '@/components/models';

const apiKey = "59f5d73944c323b9071de991b104300b"; // OpenWeatherMap API key
const weatherBaseUrl = `https://api.openweathermap.org/data/2.5/` // BaseUrl API

export const getWeather = async (city:string): Promise<WeatherData|null> => {
  try{
    const response = await axios.get(`${weatherBaseUrl}weather`,{
      params:{
        q: city,
        units: "metric",
        appid:apiKey,
      },
    });
    return response.data;
  } catch(error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};

export const getForecast = async (city:string): Promise<ForecastData[]> => {
  try{
    const response = await axios.get(`${weatherBaseUrl}forecast`,{
      params:{
        q: city,
        units: "metric",
        appid:apiKey,
      },
    });

    const forecastList = response.data.list;
    const noonForecasts: ForecastData[] = forecastList.filter((item :any) =>
    item.dt_txt.includes("12:00:00")  //moet op middag staan voor de API de volgende dag te laden
  );

    return noonForecasts.slice(0, 4);
  } catch(error) {
    console.error("Error fetching forecast data", error);
    return [];
  }
};


