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
export interface CalendarEventGroup {
	id: number
	name: string
	image: string
	defaultGroup: boolean
	createdAt: string
	updatedAt: string
}

export interface CalendarEvent {
	id: number
	title: string
	description: string
	start: string
	end: string
	createdAt: string
	updatedAt: string
	groupId: number
	organizer: number
	Group: CalendarEventGroup
	eventType: string
	displayName?: string
	startDate: string
	startTime: string
	endDate: string
	endTime: string
}

export interface CalendarDay {
	day: number
	date: string
	faded: boolean
	isToday?: boolean
	eventLines?: string[]
	events?: CalendarEvent[]
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
