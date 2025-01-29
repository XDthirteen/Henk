export interface User {
    username: string, 
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    chosenLanguage: number
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