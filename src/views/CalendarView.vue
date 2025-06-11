/*#####################################
/ 
/ # CalendarView.vue
/ # ==================
/ # Description:
/ # ------------
/ # Able to see dates and planned events.
/ 
/ # Author: Jorn Vierbergen
/ # Creation date: 16/11/2024
/ 
#################
/ 
/ Changelog:
/ ----------
/ 06/12/2024 - Jorn Vierbergen
/ - Added: Days from previous and next month.
/ 06/01/2025 - Jorn Vierbergen
/ - Added: Selectable datum.
/ 08/01/2025 - Jorn Vierbergen
/ - Added: Visual event markers per date.
/ 20/01/2025 - Jorn Vierbergen
/ - Added: Expandable/collapsable div with event data.
/ 27/01/2025 - Jorn Vierbergen
/ - Added: Events over multiple days. Event line + dates in expandable div at event time.
/ 08/02/2025 - Jorn Vierbergen
/ - Fixed: Merge deletion CalendarDay in /components/models.ts
/ - Fixed: Merge deletion prettier config in .prettierrc.json
/ - Fixed: Expandable div height
/ - Fixed: No-scrolling on page
/ 10/02/2025 - Jorn Vierbergen
/ - Added: Event items clickable
/ 13/02/2025 - Jorn Vierbergen
/ - Added: scrollable event items in case of unable to display all.
/ - Edited: expandable div moved to component ExpandableDiv.vue
/ 24/02/2025 - Jorn Vierbergen
/ - Added: API integrated event.service.ts
/ - Edited: Optimalize calender function usage.
/ - Edited: API data cachen
/ 28/02/2025 - Jorn Vierbergen
/ - Added: Date and time in ISO + convert to visual date and time
/ - Fixed: Event lines only one time added to HTML element
/ 13/03/2025 - Jorn Vierbergen
/ - Fixed: expandableDiv mobile browser adress makes screen smaller
/ 15/03/2025 - Jorn Vierbergen
/ - Added: SwipeDirection service
/ - Fixed: TimeZones correct convertion from UTC/ISO time from api
/ 17/03/2025 - Jorn Vierbergen
/ - BUG: TimeZones do not work correct, asked for help, did not get.
/ 07/05/2025 - Arno Defillet
/ - Toegevoegd: GroupNavigation Component om te kunnen navigeren naar de groepen
/ 16/05/2025 - Jorn Vierbergen
/ - Fixed: Timezones, UTC time.
/ - Added: Tasks display on calendar
/ 23/05/2025 - Jorn Vierbergen
/ - Changed: Prefference of what is visible on personal and group calendar.
/ - Added: Display name of group
/ 24/05/2025 - Jorn Vierbergen
/ - Added: EventPopup.vue component
/ - Changed: Return to last open group calendar after creating event
/ - Added: Pass selected day data to CalendarEventView.vue for creating event
/ 02/06/2025 - Jorn Vierbergen
/ - Added: Refetch events after deletion (edit refetches on it's own since it is a different view)
/ 10/06/2025 - Jorn Vierbergen
/ - Added: Show group name on top of Calendar
/ - Changed: CSS last time before sending code for review. Hi there :D
/ 
/ To do:
/ - Selecting event in expandable div opens event description.
/ - Use date instead of lists for months and weekdays.
/ This is what you get when the teacher starts to explain dates when you are a month into making a calendar app.
/ 
/ - Optimalization calendar:
/ - Update only calendar days that have events instead of all days on api loaded
/ - API get only the events for the dates needed, now we get the events for 3 months
/ - Use filter() instead of forEach and push for arrays
/ - When expandableDiv is expanded, add a buttons to select next day and previous day. So you don't have to minimalize
the div while navigating
/ - Desktop mode, replace expandable div with a div on the right side of calendar. More user friendly
/ - Pass group name with group_id through route query, when selecting group calendar, 1 less api call
/
/ - NTH Change month to specified month. Click on month, drop down menu
/ - NTH Change days of week to specified order. Current: Starting on monday (Europe, ISO 8601), saturday (Hebrew Calendar) or sunday (United States)
/
/ - Optimalization and NTH HENK: Helpful Event Note Keeper:
/ - Create 1 general service file for api calls for the same backend
/ - Create 1 general service file for error handeling
/ - Refactor every await and loop as in file optimal.js
/ - Dark theme option in MainLayout by variables. eg: 'background'(1,2,3,4), 'border'
/ 
/ Comments:
/ ------------
/ None, I won't stand for them!
/ 
#####################################*/

<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService, isApiError } from '@/services/api.service'
import expandableDiv from '@/components/ExpandableDiv.vue';
import { swipe } from '@/utils/swipeDetection';
import GroupNavigation from '@/components/GroupNavigation.vue';
import type { CalendarDay, CalendarEvent } from '@/components/models';
import StyledButton from '@/components/StyledButton.vue';
import ErrorPopup from '@/components/popups/ErrorPopup.vue';

const showErrorPopup = ref(false);
const errorMessage = ref<string>('');
const errorStatus = ref<number | null>(null);
const errorExplanation = ref<string>('');

const { onTouchStart, onTouchEnd } = swipe();
const { getData } = apiService();

const route = useRoute();
const router = useRouter();

// Set calendar for groups, personal as default
let groupAgenda = 'personal';

const groupId = route.query.group_id;
if (typeof groupId === 'string') {
  groupAgenda = groupId;
}
else if (Array.isArray(groupId)) {
  groupAgenda = groupId[0] ?? 'personal';
};

const calendarGroupName = ref<string>('');

const getGroupName = async () => {
  calendarGroupName.value = 'Personal'
  if (groupAgenda !== 'personal') {
    const groupName = await getData(`/api/groups/${groupAgenda}`);
    if (isApiError(groupName)) {
      return;
    };
    calendarGroupName.value = groupName.name;
  };
};

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
};

const { timeZone, dateTimeNotation, hour12Notation, hourNotation, minuteNotation, dayNotation, monthNotation, yearNotation } = dateTimeSettings;
type NumberNotation = 'numeric' | '2-digit';
type MonthNotation = 'numeric' | '2-digit' | 'short' | 'long';

const events = ref<CalendarEvent[]>([]);
const selectedDate = ref<CalendarDay & { events?: CalendarEvent[] } | null>(null);

// System time
const currentDate = new Date();
const currentYear = ref(currentDate.getUTCFullYear());
const currentMonth = ref(currentDate.getUTCMonth());
const currentDay = ref(currentDate.getUTCDate());

const eventCache = ref<{ [key: string]: any[] }>({});

const weekdays = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
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
  const formattedDate = formatDate(dateTime);
  const formattedTime = formatTime(dateTime);
  return { date: formattedDate, time: formattedTime };
};

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
    const fromDate = new Date(Date.UTC(year, month - 1, 1)).toISOString().split('T')[0];
    const toDate = new Date(Date.UTC(year, month + 2, 0)).toISOString().split('T')[0];
    try {
      const allEvents: any[] = [];
      if(groupAgenda == 'personal'){
        const personalEvents = await getData(`/api/events/personal?from=${fromDate}&to=${toDate}`);
        if (isApiError(personalEvents)) {
          errorStatus.value = personalEvents.status;
          errorMessage.value = personalEvents.message;
          errorExplanation.value = 'Unable to load personal events.';
          showErrorPopup.value = true;
          if (errorStatus.value === 401) router.push({name: 'login'});
        }
        else {
          personalEvents.forEach((item: any) => {
            allEvents.push({ ...item, eventType: 'personal'});
          });
        };

        const tasks = await getData(`/api/tasks?completed=false`);
        if (isApiError(tasks)) {
          errorStatus.value = tasks.status;
          errorMessage.value = tasks.message;
          errorExplanation.value = 'Unable to load tasks.';
          showErrorPopup.value = true;
          if (errorStatus.value === 401) router.push({name: 'login'});
        }
        else {
          tasks.forEach((item: any) => {
            // change dueDate to start and end, re-use event functions
            item.start = item.dueDate;
            item.end = item.dueDate;
            allEvents.push({ ...item, eventType: 'task', displayName: 'Task' });
          });
        };
      };

      // get all group events when checking personal agenda
      const group = groupAgenda != 'personal' ? `groupId=${groupAgenda}&` : ``;
      const groupEvents = await getData(`/api/events?${group}from=${fromDate}&to=${toDate}`);
      if (isApiError(groupEvents)) {
          errorStatus.value = groupEvents.status;
          errorMessage.value = groupEvents.message;
          errorExplanation.value = 'Unable to load group events.';
          showErrorPopup.value = true;
          if (errorStatus.value === 401) router.push({name: 'login'});
      }
      else {
        groupEvents.forEach((item: any) => {
          allEvents.push({ ...item, eventType: 'group', displayName: `${item.Group.name}` });
        });
      };

      const convertedEvents: any[] = [];

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
      console.error('Error fetching and processing events:', error);
    };
  };

  // Reload calendarDays
  //console.log(events.value)
  calendarDays.value = generateCalendarDays();
  selectToday();
  calculateExpandableDiv();
};

// Get event types for each day
const getEventLinesForDay = (date: string) => {
  let eventLines: string[] = [];

  events.value.forEach(event => {
    const dateDate = new Date(date);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    if (dateDate >= startDate && dateDate <= endDate) {
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
  const today = formatDate();

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
    const calendarElement = document.querySelector('.calendar') as HTMLElement;
    if (calendarElement) {
      const calendarPosition = calendarElement.getBoundingClientRect();
      document.documentElement.style.setProperty('--calendar-top', `${calendarPosition.top - 8}px`);  // -8px for shadow box
      document.documentElement.style.setProperty('--calendar-bottom', `${calendarPosition.bottom + 10}px`);   // +10px for shadow box
    };
  });
};

const selectToday = () => {
  const today = calendarDays.value.find(day => day.isToday);
  if (today) selectDate(today);
};

const goToPrevMonth = () => {
  currentMonth.value = (currentMonth.value - 1 + 12) % 12;
  if (currentMonth.value === 11) currentYear.value--;
  fetchEventsForMonth();
};

const goToNextMonth = () => {
  currentMonth.value = (currentMonth.value + 1) % 12;
  if (currentMonth.value === 0) currentYear.value++;
  fetchEventsForMonth();
};

const selectDate = (date: CalendarDay) => {
  //console.log(`Clicked on: ${date.date}`);

  const eventsForSelectedDate: CalendarEvent[] = [];

  events.value.forEach(event => {
    // Check if event in selected date range
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const eventDate = new Date(date.date);

    if (eventDate >= eventStartDate && eventDate <= eventEndDate) {
      eventsForSelectedDate.push(event);
    };
  });
  selectedDate.value = {
    ...date,
    events: eventsForSelectedDate,
  };
};

const addEvent = () => {
  // TS string because we stringify the object
  const query: { selectedDate?: string; group_id?: string } = {};
  if (selectedDate.value?.date) {
    query.selectedDate = selectedDate.value.date;
  };
  if (groupAgenda) {
    query.group_id = groupAgenda;
  };

  router.push({
    name: 'calenderEvents',
    query: query,
  });
};

// reload after deleting a event
watch(() => route.query.reload, async () => {
  eventCache.value = {};
  await getGroupName();
  fetchEventsForMonth();
});

onMounted(async () => {
  await getGroupName();
  fetchEventsForMonth();
});

</script>

<template>
  <GroupNavigation></GroupNavigation>
  <div class="center">
    <div class="group-calendar">
        {{ calendarGroupName }}
    </div>
    <div class="calendar-wrapper">
      
      <div class="calendar" @touchstart="onTouchStart" @touchend="(event) => {
        const direction = onTouchEnd(event);
        if (direction === 'right') goToPrevMonth();
        if (direction === 'left') goToNextMonth();
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
      <expandableDiv :events="events" :selectedDate="selectedDate" :group_id="groupAgenda"/>

      <StyledButton type="primary" class="add-event-button" @click="addEvent">Add event</StyledButton>
    </div>
  </div>
  <ErrorPopup
  v-if="showErrorPopup"
  :errorExplanation="errorExplanation"
  :errorStatus="errorStatus"
  :errorMessage="errorMessage"
  @close="showErrorPopup = false"
  />
</template>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.group-calendar {
  text-align: center;
  margin: 0 3.5rem 0 3.5rem;
  color: var(--black-text);
  max-height: 3.2em;
  overflow: hidden;
}

.calendar-wrapper {
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
  box-sizing: border-box;
}

.calendar {
  margin: 2%;
  border: 1px solid var(--black-text);
  box-shadow: 2px 2px 8px var(--title-border);
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
  border: 1px solid black;
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

.event-line.task {
  bottom: 1px;
}

/* Colors based on event type */
.personal {
  background-color: red;
}

.group {
  background-color: green;
}

.task {
  background-color: blue;
}
</style>
