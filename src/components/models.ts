///////////////////
// USER SETTINGS //
///////////////////

export interface EditingState {
  firstname: boolean;
  lastname: boolean;
  email: boolean;
  language: boolean;
}

export interface ParamEditingState {
  city: boolean,
  app: boolean,
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
  app: string,
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

//////////////
// CALENDAR //
//////////////
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

/////////////
// WEATHER //
/////////////
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

export interface Language {
  code: string;
  label: string;
}


///////////
// TASKS //
///////////

export interface Task {
  completed: boolean,
  id?: number,
  title: string,
  description: string,
  dueDate?: string,
  userId?: number
}

// create group interface


export interface icon {
  id: number;
  name: string;
  image: string;
}


export interface Group {
  id: number
  name: string
  icon: string
  tasks: {
    completed: boolean
    id?: number
    title: string
    description: string
    dueDate?: string
    userId?: number
  }[]
  image?: string  // Voeg 'image' als optioneel toe
}



