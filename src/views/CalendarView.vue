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
/
/      To do:
/      - Make group calendars
/      - Change month to specified month. Click on month, drop down menu
/      - Selecting event in expandable div opens event description.
/      - Add events functionality to event button.
/      - Add API
/      - Remove test data
/      -? Load events only for previous, current and next month. (optimalization) 
/
/      Opmerkingen:
/      ------------
/      Enige opmerkingen?
/      
#####################################*/

<script setup lang="ts">
import type { CalendarDay } from "@/components/models";
import expandableDiv from "@/components/ExpandableDiv.vue";
import { ref, computed, onMounted, nextTick } from "vue";

// TEST DATA
const events = {
	personal: [
		{ startDate: "01/02/2025", startTime: "08:00", endDate: "02/02/2025", endTime: "08:00" , title: "test title", description: "desceription < Spelling :/"},
		{ startDate: "04/02/2025", startTime: "09:00", endDate: "14/03/2025", endTime: "09:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
		{ startDate: "05/02/2025", startTime: "08:00", endDate: "05/02/2025", endTime: "08:00" },
	],
	group: [
    	{ startDate: "02/02/2025", startTime: "08:02", endDate: "02/02/2025", endTime: "08:02" },
    	{ startDate: "05/02/2025", startTime: "09:02", endDate: "05/02/2025", endTime: "09:05" },
  	],
	planned: [
    	{ startDate: "10/02/2025", startTime: "08:00", endDate: "10/02/2025", endTime: "08:00" },
    	{ startDate: "11/02/2025", startTime: "09:00", endDate: "11/02/2025", endTime: "09:00" },
  	],
};

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

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

// Format date to dd/mm/yyyy
const formatDate = (day: number, month: number, year: number): string => {
	const formattedDay = day < 10 ? `0${day}` : `${day}`;
  	const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
  	return `${formattedDay}/${formattedMonth}/${year}`;
};

// Days for calendar
const calendarDays = computed(() => {
  	const year = currentYear.value;
  	const month = currentMonth.value;

  	const daysInMonth = new Date(year, month + 1, 0).getDate();

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
			const fullDate = formatDate(day, targetMonth, targetYear);

			days.push({
				day: targetDate.getDate(),
				month: targetMonth,
				year: targetYear,
				date: fullDate,
				faded,
				isToday:
					!faded &&
					targetDate.getDate() === new Date().getDate() &&
					targetYear === new Date().getFullYear() &&
					targetMonth === new Date().getMonth(),
				dayOfWeek: weekdays[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1],
				// Add event-line info to each day (whether it has events or not)
				eventLines: getEventLinesForDay(fullDate), // Get event types for this date
			});
		}
  	};

	const daysInPrevMonth = new Date(year, month, 0).getDate();
	addDays(startOffset, daysInPrevMonth - startOffset + 1, true, -1);
	addDays(daysInMonth, 1, false, 0);
	addDays(endOffset, 1, true, 1);

	return days;
});

// Go to previous and next month
const goToPrevMonth = () => {
  	currentMonth.value = (currentMonth.value - 1 + 12) % 12;
  	if (currentMonth.value === 11) currentYear.value--;
  	calculateExpandableDiv();
};

const goToNextMonth = () => {
  	currentMonth.value = (currentMonth.value + 1) % 12;
  	if (currentMonth.value === 0) currentYear.value++;
  	calculateExpandableDiv();
};

// Expandable div calculation
const calculateExpandableDiv = () => {
	nextTick(() => {
    	const calendarElement = document.querySelector(".calendar-wrapper") as HTMLElement;
    	if (calendarElement) {
      		const calendarPosition = calendarElement.getBoundingClientRect();
      		document.documentElement.style.setProperty("--calendar-top", `${calendarPosition.top}px`);
      		document.documentElement.style.setProperty("--calendar-bottom", `${calendarPosition.bottom}px`);
    	}
  	});
};

// Select today on startup
const todayClick = () => {
  	const today = document.querySelector('.today');
  	if (today) {
    	today.click();
  	}
};

// Event button
const addEvent = () => {
  	console.log("Event button clicked!");
};


// Set event-lines on calendar
const getEventLinesForDay = (date: string) => {
  	let eventLines = [];

  	Object.entries(events).forEach(([type, eventList]) => {
    	eventList.forEach(event => {
      	const { startDate, endDate } = event;

      	// Convert startDate, endDate back to date objects to compare
		const start = new Date(startDate.split("/").reverse().join("-"));
		const end = new Date(endDate.split("/").reverse().join("-"));
		const current = new Date(date.split("/").reverse().join("-"));

		// Check if selected date is within event range
		if (current >= start && current <= end) {
			eventLines.push(type); // Add event type for styling
		}
		});
	});

  	return eventLines;
};

// Selected date
const selectedDate = ref<CalendarDay | null>(null);

// Select date
const selectDate = (date: CalendarDay) => {
  	selectedDate.value = date;
  	console.log(`Clicked on: ${date.date} ${date.dayOfWeek}`);
};

onMounted(() => {
  	calculateExpandableDiv();
  	todayClick();
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
						<div v-for="eventType in getEventLinesForDay(date.date)" :key="eventType" :class="['event-line', eventType]"></div>
					</div>
				</div>
      		</div>
    	</div>

    	<!-- Expandable Div -->
		<expandableDiv :selectedDate="selectedDate" />

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
