export interface EditingState {
  firstname: boolean;
  lastname: boolean;
  email: boolean;
  language: boolean;
}

export interface ParamEditingState {
  city: boolean,
  defaultApp: boolean,
  theme: boolean
}

export interface SavedValues {
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  language: string
}

export interface ParamSavedValues {
  city: string,
  defaultApp: string,
  theme: string
}

export interface UserData {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  defaultLanguage: string;
}

export interface UserParamData {
  city: string,
  app: string,
  theme: string
}

export interface CalendarDay {
  day: number
  month: number
  year: number
  date: string
  faded: boolean
  isToday?: boolean
  dayOfWeek: string
  eventLines: string[]
}

// local weather
export interface WeatherData {
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

// 4 day forecast
export interface ForecastData{
  dt_txt: string;
  main:{
    temp: number;
    humidity: number;
  };
  weather:{
    description: string;
  }[];
  wind:{
    speed: number;
  };
}
