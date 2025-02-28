/*#####################################
/      
/      #  CalendarView.vue
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Het kunnen zien van datums en geplande events.
/ 
/      #  Auteur: Jorn Vierbergen
/      #  Datum aangemaakt: 16/11/2024
/
#################
/
/      Changelog:
/      ----------
/      06/12/2024 - Jorn Vierbergen
/          - Toegevoegd: Dagen van vorige en volgende maand.
/      06/01/2025 - Jorn Vierbergen
/          - Toegevoegd: Selecteerbare datum.
/      08/01/2025 - Jorn Vierbergen
/          - Toegevoegd: Visuele event markers per datum.
/      20/01/2025 - Jorn Vierbergen
/          - Toegevoegd: Expandable/collapsable div met event data.
/      27/01/2025 - Jorn Vierbergen
/          - Toegevoegd: Events over meerdere dagen. Event lijn + datums in expandable div bij event time gezet.
/      08/02/2025 - Jorn Vierbergen
/          - Fixed: Merge deletion CalendarDay in /components/models.ts
/          - Fixed: Merge deletion prettier config in .prettierrc.json
/          - Fixed: Expandable div height
/          - Fixed: No-scrolling on page
/      10/02/2025 - Jorn Vierbergen
/          - Toegevoegd: Event items klikbaar
/      13/02/2025 - Jorn Vierbergen
/          - Toegevoegd: scrollable event items in case of unable to display all.
/          - Aangepast: expandable div verplaatst naar component ExpandableDiv.vue
/      24/02/2025 - Jorn Vierbergen
/          - Toegevoegd: API integratie event.service.ts
/          - Aangepast: Optimalizeren calender functie gebruik.
/          - Aangepast: API data cachen
/      28/02/2025 - Jorn Vierbergen
/          - Toegevoegd: Datum en tijd in ISO + omvormen naar visueel tijdstip
/          - Fixed: Event lines enkel eenmaal toevoegen in HTML element
/
/      To do:
/      - Make group calendars
/      - Change month to specified month. Click on month, drop down menu
/      - Selecting event in expandable div opens event description.
/      - Add events functionality to event button.
/      - Remove test data
/
/      Opmerkingen:
/      ------------
/      Enige opmerkingen?   ---- set events in calendarDay interface
/      
#####################################*/

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { eventService } from "@/services/event.service.ts";
import type { CalendarDay } from "@/components/models";
import expandableDiv from "@/components/ExpandableDiv.vue";

const { getData } = eventService();

// TEST DATA
let group = 4
// TIME SETTINGS FROM USER SETTINGS
const notationDateTime = {
	dateNotation: 'nl-BE', //'nl-BE', 'en-US', ...
	timeNotation: 'nl-BE', // same as dateNotation if not provided
	monthNotation: '2-digit' as MonthNotation //2-digit, short, long
}
const { dateNotation, timeNotation, monthNotation } = notationDateTime;
type MonthNotation = 'numeric' | 'short' | 'long' | '2-digit';


const events = ref([]);
const selectedDate = ref<CalendarDay & { events?: any[] } | null>(null);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

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

const formatDate = (isoDateTime: string) => {
	const date = new Date(isoDateTime);
	// date.toLocaleString("en-US", { timeZone: "Europe/Brussels" });
	return date.toLocaleDateString(dateNotation || null, {
		year: '2-digit',
		month: monthNotation,
		day: '2-digit',
	});
};

const formatTime = (isoDateTime: string) => {
	const date = new Date(isoDateTime);
	// Set time format to user settings, same as date user settings or local
	return date.toLocaleTimeString(timeNotation || dateNotation || null, {
		hour: '2-digit',
		minute: '2-digit',
	});
};

// Convert ISO (UTC) time to local time or time selected in user settings
const formatDateTime = (isoDateTime: string) => {
	const formattedDate = formatDate(isoDateTime)
	const formattedTime = formatTime(isoDateTime)
	return { date: formattedDate, time: formattedTime };
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
		const fromDate = new Date(year, month-1, 1).toISOString().split("T")[0];
		const toDate = new Date(year, month+2, 0).toISOString().split("T")[0];
		//console.log('from', fromDate, 'to', toDate);

		try {
			const allEvents = [];
			const personalEvents = await getData(`events/personal?from=${fromDate}&to=${toDate}`);
			personalEvents.forEach((item: any) => {
      			allEvents.push({ ...item, eventType: 'personal' });
    		});

			const groupEvents = await getData(`events?from=${fromDate}&to=${toDate}`);
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
			events.value.sort((a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1);

		} 
		catch (error) {
			console.error("Error fetching and processing events:", error);
		}
	}
	// Reload calendarDays
	calendarDays.value = generateCalendarDays();
};

// Get event types for each day
const getEventLinesForDay = (date: string) => {
	let eventLines: string[] = [];

	events.value.forEach(event => {
		if (date >= event.start.split('T')[0] && date <= event.end.split('T')[0]) {
      		const type = event.eventType;
			if (!eventLines.includes(type)) {
				eventLines.push(type);
			};
		};
	});
	return eventLines;
};

// Days for calendar
const generateCalendarDays = (): CalendarDay[] => {
  	const year = currentYear.value;
  	const month = currentMonth.value;

  	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();

  	const firstDayOfWeek = new Date(year, month, 1).getDay();
  	const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  	const lastDayOfWeek = new Date(year, month + 1, 0).getDay();
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
			const targetDate = new Date(year, month + offsetMonth, day);
			const targetMonth = targetDate.getMonth();
			const targetYear = targetDate.getFullYear();
			const targetDay = targetDate.getDate()
			// fcking bull sh*t
			const fullDate = targetDate.toLocaleDateString('en-GB', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').reverse().join('-');
   			const { date: convertedDate } = formatDateTime(fullDate);

			days.push({
				day: targetDay,
				month: targetMonth,
				year: targetYear,
				date: fullDate,
				convertedDate: convertedDate,
				faded,
				isToday:
					!faded && targetDate.toDateString() === new Date().toDateString(),
				dayOfWeek: weekdays[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1],
				// Add eventLine to each day (events or not)
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
	const calendarElement = document.querySelector(".calendar-wrapper") as HTMLElement;
	if (calendarElement) {
		const calendarPosition = calendarElement.getBoundingClientRect();
		document.documentElement.style.setProperty("--calendar-top", `${calendarPosition.top}px`);
		document.documentElement.style.setProperty("--calendar-bottom", `${calendarPosition.bottom}px`);
	};
};

// Select today on startup
const selectToday = () => {
	const today = calendarDays.value.find(day => day.isToday);
	if (today) {
		selectDate(today);
	};
};

// Event button
const addEvent = () => {
  	console.log("Event button clicked!");
};

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
	console.log(`Clicked on: ${date.date} ${date.dayOfWeek}`);

	const eventsForSelectedDate = [];

	events.value.forEach(event => {
		// Check if event in selected date range
		const eventStartDate = event.start.split('T')[0];
		const eventEndDate = event.end.split('T')[0];

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
	nextTick(() => {
		selectToday();
  		calculateExpandableDiv();
	});
});

</script>

<template>
<div class="center">
	<div class="calendar-wrapper">
		<div class="calendar">
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
				<div
				v-for="date in calendarDays"
				:key="date.date"
				:id="date.date"
				:class="['date', {faded: date.faded, today: date.isToday}, {'selected-day': selectedDate?.date === date.date}]"
				@click="selectDate(date)"
				>
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
    padding-top: 4px; /* Offset for expandable div */
}

.calendar {
    border: 1px solid black;
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
    background: #007BFF;
    color: white;
}

#month-year{
    justify-content: center;
    align-items: center;
}

/* change button, also duplicate in ExpandableDiv.vue component */
button{
    background: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

button:hover {
    background: #0056b3;
}

.nav-button {
    padding: 5px 10px;
}

.add-event-button {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%); /* Center adjust for element length*/
    padding: 10px 20px;
    z-index: 4;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: white;
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

.date{
	cursor: pointer;
}

.date span{
    position: relative;
    z-index: 2;
    top: -8px;
}

.selected-day {
    border: 2px solid black;
    border-radius: 4px;
}

.today {
    background: grey;
    border-radius: 4px;
    color: white;
    font-weight: bold;
}

.faded {
    color: #aaa;
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
