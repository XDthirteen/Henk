/*#####################################
/
/ # CalendarView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Het kunnen zien van datums en geplande events.
/
/ # Auteur: Jorn Vierbergen
/ # Datum aangemaakt: 16/11/2024
/
#################
/
/ Changelog:
/ ----------
/ 06/12/2024 - Jorn Vierbergen
/ - Toegevoegd: Dagen van vorige en volgende maand.
/ 06/01/2025 - Jorn Vierbergen
/ - Toegevoegd: Selecteerbare datum.
/ 08/01/2025 - Jorn Vierbergen
/ - Toegevoegd: Visuele event markers per datum.
/ 20/01/2025 - Jorn Vierbergen
/ - Toegevoegd: Expandable/collapsable div met event data.
/ 27/01/2025 - Jorn Vierbergen
/ - Toegevoegd: Events over meerdere dagen. Event lijn + datums in expandable div bij event time gezet.
/ 08/02/2025 - Jorn Vierbergen
/ - Fixed: Merge deletion CalendarDay in /components/models.ts
/ - Fixed: Merge deletion prettier config in .prettierrc.json
/ - Fixed: Expandable div height
/ - Fixed: No-scrolling on page
/ 10/02/2025 - Jorn Vierbergen
/ - Toegevoegd: Event items klikbaar
/ 13/02/2025 - Jorn Vierbergen
/ - Toegevoegd: scrollable event items in case of unable to display all.
/ - Aangepast: expandable div verplaatst naar component ExpandableDiv.vue
/ 24/02/2025 - Jorn Vierbergen
/ - Toegevoegd: API integratie event.service.ts
/ - Aangepast: Optimalizeren calender functie gebruik.
/ - Aangepast: API data cachen
/ 28/02/2025 - Jorn Vierbergen
/ - Toegevoegd: Datum en tijd in ISO + omvormen naar visueel tijdstip
/ - Fixed: Event lines enkel eenmaal toevoegen in HTML element
/ 13/03/2025 - Jorn Vierbergen
/ - Fixed: expandableDiv mobile browser adress makes screen smaller
/ 15/03/2025 - Jorn Vierbergen
/ - Toegevoegd: SwipeDirection service
/ - Fixed: TimeZones correct convertion from UTC/ISO time from api
/ 17/03/2025 - Jorn Vierbergen
/ - BUG: TimeZones do not work correct, asked for help, did not get.
/ 20/04/2025 - Jorn Vierbergen
/ - Toegevoegd: UTC time api, to check if the local UTC time is correct.
/ 07/05/2025 - Arno Defillet
/ - Toegevoegd: GroupNavigation Component om te kunnen navigeren naar de groepen
/
/
/ To do:
/ - Selecting event in expandable div opens event description.
/ - Add events functionality to event button.
/ - Remove test data
/ - Use house style css as var(--primary-blue) (in assets folder)
/
/ - BUG: Timezones do not work correct.
/ - api to get utc independent from system time, compare api and system time
/
/ - Optimalization:
/ - Update only calendar days that have events instead of all days on api loaded
/ - API get only the events for the dates needed, now we get the events for 3 months
/ - Use filter() instead of forEach and push for arrays
/
/ - NTH Change month to specified month. Click on month, drop down menu
/ - NTH Change days of week to specified order. Current: Starting on monday (Europe, ISO 8601), saturday (Hebrew
Calendar) or sunday (United States)
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { eventService } from "@/services/event.service.ts";
import type { CalendarDay } from "@/components/models";
import expandableDiv from "@/components/ExpandableDiv.vue";
import { swipe } from '@/utils/swipeDetection';
import GroupNavigation from "@/components/GroupNavigation.vue";

const { onTouchStart, onTouchEnd } = swipe();
const { getData } = eventService();

// TEST DATA
// let groupAgenda = 13 //group id, changes when changing groups

const route = useRoute()
let groupAgenda = route.query.group_id

// TIME SETTINGS FROM USER SETTINGS
const dateTimeSettings = {
  //timeZone: 'America/New_York', //'Europe/Brussels', 'America/New_York', ...
  timeZone: 'Europe/Brussels',
  // date/time displayed per locale format
  dateTimeNotation: 'en-GB', // 'en-GB' D M Y, 'be-NL' M D Y, 'en-US', ...
  // console.log(navigator.language);

  hour12Notation: false,
  hourNotation: '2-digit' as NumberNotation,
  minuteNotation: '2-digit' as NumberNotation,
  secondNotation: '2-digit' as NumberNotation,

  dayNotation: '2-digit' as NumberNotation,
  monthNotation: 'long' as MonthNotation,
  yearNotation: 'numeric' as NumberNotation,
}

const { timeZone, dateTimeNotation, hour12Notation, hourNotation, minuteNotation, dayNotation, monthNotation, yearNotation } = dateTimeSettings;
type NumberNotation = 'numeric' | '2-digit';
type MonthNotation = 'numeric' | '2-digit' | 'short' | 'long';
// -------

const events = ref([]);
const selectedDate = ref<CalendarDay & { events?: any[] } | null>(null);

// System time
const currentDate = new Date();
const currentYear = ref(currentDate.getUTCFullYear());
const currentMonth = ref(currentDate.getUTCMonth());
const currentDay = ref(currentDate.getUTCDate());

const eventCache = ref<{ [key: string]: any[] }>({});

const weekdays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// If no isoDateTime string is given, use current date
const formatDate = (isoDateTime?: string) => {
  const date = new Date(isoDateTime ?? new Date().toISOString());
  return date.toLocaleDateString(dateTimeNotation, {
    timeZone,
    year: yearNotation,
    month: monthNotation,
    day: dayNotation,
  });
};

const formatTime = (isoDateTime?: string) => {
  const date = new Date(isoDateTime ?? new Date().toISOString());
  return date.toLocaleTimeString(dateTimeNotation, {
    timeZone,
    hour: hourNotation,
    minute: minuteNotation,
    hour12: hour12Notation,
  });
};

const formatDateTime = (isoDateTime?: string) => {
  const dateTime = isoDateTime ?? new Date().toISOString();
  const formattedDate = formatDate(dateTime)
  const formattedTime = formatTime(dateTime)
  return { date: formattedDate, time: formattedTime };
};

const getApiUTC = async () => {
  const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
  const data = await response.json();
  return new Date(data.utc_datetime);
};


const dateTimeToISO = () => {
  const now = new Date();
  console.log(now.toISOString());
};

const dateTimeToUTC = (isoDateTime?: string) => {
  const dateTime = isoDateTime ?? new Date();
  const utcFormatted = dateTime.toLocaleString("en-GB", { timeZone: "UTC" });
}

// Fetch events selected month
const fetchEventsForMonth = async () => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const cacheKey = `${year}-${month}`;

  if (eventCache.value[cacheKey]) {
    events.value = eventCache.value[cacheKey];
  }
  else {
    // QUICK FIX, gets data from 3 months!, FIX LATER for less data each api call.
    // Duplicate data also in caching...
    const fromDate = new Date(Date.UTC(year, month - 1, 1)).toISOString().split("T")[0];
    const toDate = new Date(Date.UTC(year, month + 2, 0)).toISOString().split("T")[0];
    console.log('from', fromDate, 'to', toDate);

    try {
      const allEvents = [];
      const personalEvents = await getData(`events/personal?from=${fromDate}&to=${toDate}`);
      personalEvents.forEach((item: any) => {
        allEvents.push({ ...item, eventType: 'personal' });
      });

      // get all group events when checking personal agenda
      const group = groupAgenda != 'personal' ? `groupId=${groupAgenda}` : ``;
      const groupEvents = await getData(`events?${group}from=${fromDate}&to=${toDate}`);
      groupEvents.forEach((item: any) => {
        allEvents.push({ ...item, eventType: 'group' });
      });

      const convertedEvents = [];

      allEvents.forEach(event => {
        const { date: startDate, time: startTime } = formatDateTime(event.start);
        const { date: endDate, time: endTime } = formatDateTime(event.end);

        convertedEvents.push({
          ...event,
          startDate,
          startTime,
          endDate,
          endTime,
        });
      });

      // Update events
      events.value = [...convertedEvents];
      eventCache.value[cacheKey] = events.value;
      // sorting only, UTC is not important here
      events.value.sort((a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1);

    }
    catch (error) {
      console.error("Error fetching and processing events:", error);
    }
  }
  // Reload calendarDays
  calendarDays.value = generateCalendarDays();
  selectToday();
};

// Get event types for each day
const getEventLinesForDay = (date: string) => {
  let eventLines: string[] = [];

  events.value.forEach(event => {
    if (date >= event.startDate && date <= event.endDate) {
      const type = event.eventType;
      if (!eventLines.includes(type)) {
        eventLines.push(type);
      };
    };
  });
  return eventLines;
};

// Days for calendar
// No need for time, except for finding today.
const generateCalendarDays = (): CalendarDay[] => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const today = formatDate()

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getDate();
  const daysInPrevMonth = new Date(Date.UTC(year, month, 0)).getDate();

  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const lastDayOfWeek = new Date(Date.UTC(year, month + 1, 0)).getDay();
  const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;

  const days: CalendarDay[] = [];

  const addDays = (
    count: number,
    startDay: number,
    faded: boolean,
    offsetMonth: number
  ) => {
    for (let i = 0; i < count; i++) {
      const day = startDay + i;
      // Create Date in UTC so it does not fuck up the god damned timezone things
      const targetDate = new Date(Date.UTC(year, month + offsetMonth, day));
      // fcking bull sh*t this is
      // Format all dates to selected date notation
      const fullDate = formatDate(targetDate.toISOString());
      console.log(today)
      console.log(targetDate)
      console.log(fullDate)

      days.push({
        day: day,
        date: fullDate,
        faded,
        isToday:
          !faded && fullDate === today,
        eventLines: getEventLinesForDay(fullDate),
      });
    };
  };

  addDays(startOffset, daysInPrevMonth - startOffset + 1, true, -1);
  addDays(daysInMonth, 1, false, 0);
  addDays(endOffset, 1, true, 1);

  return days;
};

const calendarDays = ref<CalendarDay[]>(generateCalendarDays());

// Expandable div calculation
const calculateExpandableDiv = () => {
  // ensure measurement happen on the next frame, after layout and styles are applied.
  requestAnimationFrame(() => {
    const calendarElement = document.querySelector(".calendar-wrapper") as HTMLElement;
    if (calendarElement) {
      const calendarPosition = calendarElement.getBoundingClientRect();
      document.documentElement.style.setProperty("--calendar-top", `${calendarPosition.top}px`);
      document.documentElement.style.setProperty("--calendar-bottom", `${calendarPosition.bottom}px`);
    };
  });
};

// Select today on startup
const selectToday = () => {
  const today = calendarDays.value.find(day => day.isToday);
  if (today) selectDate(today);
};

// Event button
// const openEventDialogue = () => {       // Modal visibility
//     isVisible.value=true
//   	console.log("Event button clicked!");
// };

// Go to previous and next month
const goToPrevMonth = () => {
  currentMonth.value = (currentMonth.value - 1 + 12) % 12;
  if (currentMonth.value === 11) currentYear.value--;
  calculateExpandableDiv();
  fetchEventsForMonth();
};

const goToNextMonth = () => {
  currentMonth.value = (currentMonth.value + 1) % 12;
  if (currentMonth.value === 0) currentYear.value++;
  calculateExpandableDiv();
  fetchEventsForMonth();
};

// Select date
const selectDate = (date: CalendarDay) => {
  console.log(`Clicked on: ${date.date}`);

  const eventsForSelectedDate = [];

  events.value.forEach(event => {
    // Check if event in selected date range
    const eventStartDate = event.startDate;
    const eventEndDate = event.endDate;

    if (date.date >= eventStartDate && date.date <= eventEndDate) {
      eventsForSelectedDate.push(event);
    };
  });
  selectedDate.value = {
    ...date,
    events: eventsForSelectedDate,
  };
  console.log("Selected Date Events:", selectedDate.value.events);
};

onMounted(() => {
  fetchEventsForMonth();
  calculateExpandableDiv();
});

</script>

<template>
  <GroupNavigation></GroupNavigation>
  <div class="center">
    <div class="calendar-wrapper">
      <div class="calendar" @touchstart="onTouchStart" @touchend="(event) => {
        const direction = onTouchEnd(event);
        if (direction === 'right') goToNextMonth();
        if (direction === 'left') goToPrevMonth();
      }">
        <!-- Header -->
        <div class="calendar-header">
          <button @click="goToPrevMonth" class="nav-button">◀</button>
          <span id="month-year">{{ months[currentMonth] }} {{ currentYear }}</span>
          <button @click="goToNextMonth" class="nav-button">▶</button>
        </div>

        <!-- Weekdays -->
        <div class="calendar-grid">
          <div v-for="weekday in weekdays" :key="weekday" class="day">
            {{ weekday }}
          </div>

          <!-- Calendar Days -->
          <div v-for="date in calendarDays" :key="date.date" :id="date.date"
            :class="['date', { faded: date.faded, today: date.isToday }, { 'selected-day': selectedDate?.date === date.date }]"
            @click="selectDate(date)">
            <span>{{ date.day }}</span>
            <div class="event-lines">
              <div v-for="eventType in date.eventLines" :key="eventType" :class="['event-line', eventType]"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expandable Div -->
      <expandableDiv :events="events" :selectedDate="selectedDate" />

      <button class="add-event-button" @click="addEvent">
        Event Button
      </button>
    </div>
  </div>
  <!-- <CalenderEventView :is-visible=isVisible default-location="genk" @close="isVisible=false"></CalenderEventView> -->

</template>

<style scoped>
.center {
  font-family: Arial;
  display: flex;
  justify-content: center;
  margin: 0;
}

.calendar-wrapper {
  width: 400px;
  padding-top: 4px;
  /* Offset for expandable div */
}

.calendar {
  margin: 2%;
  border: 1px solid var(--black-text);
  box-shadow: 2px 2px 20px var(--title-border);

  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: var(--title-background);
  color: var(--main-text);
}

#month-year {
  color: var(--main-text);
  justify-content: center;
  align-items: center;
}

/* change button, also duplicate in ExpandableDiv.vue component */
button {
  background: var(--primary-button);
  color: var(--main-text);
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

button:hover {
  background: var(--hover-button);
}

.nav-button {
  color: var(--main-text);
  padding: 5px 10px;
}

.add-event-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  /* Center adjust for element length*/
  padding: 10px 20px;
  z-index: 4;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--second-background);
  overflow-y: auto;
  max-height: 350px;
  /* Adjust height to fit 5-6 rows */
  flex-grow: 1;
  /* Allow it to grow but stay within the fixed height */
}

.day,
.date {
  position: relative;
  padding: 20%;
  text-align: center;
  font-size: 14px;
  color: black;
  /* Transparent border, accounts for the border so no elements are pushed around on hover */
  border: 2px solid transparent;
}

.date {
  cursor: pointer;
}

.date span {
  position: relative;
  z-index: 2;
  top: -8px;
}

.selected-day {
  border: 2px solid var(--title-border);
  border-radius: 4px;
}

.today {
  background: var(--title-background);
  border-radius: 4px;
  color: var(--black-text);
  font-weight: bold;
}

.today span {
  color: var(--main-text);

}

.faded {
  color: var(--lightpurple-text);
}

.event-lines {
  position: absolute;
  bottom: 5px;
  left: 10%;
  right: 10%;
  height: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-line {
  position: absolute;
  width: 100%;
  height: 3px;
  z-index: 3;
}

.event-line.personal {
  bottom: 9px;
}

.event-line.group {
  bottom: 5px;
}

.event-line.planned {
  bottom: 1px;
}

/* Colors based on event type */
.personal {
  background-color: red;
}

.group {
  background-color: green;
}

.planned {
  background-color: blue;
}
</style>
