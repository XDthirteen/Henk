<script setup lang="ts">

import type { CalendarDay } from "@/components/models";
import { ref, computed, onMounted, nextTick, defineProps } from "vue";

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

// Expandable div toggle
const isExpanded = ref(false);
const toggleExpand = () => {
  	isExpanded.value = !isExpanded.value;
};

// Swipe detection
let touchStartY = 0;
let touchEndY = 0;
const onTouchStart = (event: TouchEvent) => {
  	touchStartY = event.touches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  	touchEndY = event.touches[0].clientY;
};

const onTouchEnd = () => {
  	// Swipe up
  	if (touchStartY - touchEndY > 50) {
    	isExpanded.value = true;
  	} 
	// Swipe down
	else if (touchEndY - touchStartY > 50) {
    	isExpanded.value = false;
  	}
};

// ? merge set event data and set event lines ?
// Set event data
const getEventsForSelectedDate = () => {
  	if (!props.selectedDate) return [];

  	let allEvents: any[] = [];

  	// Find every date per event type
  	Object.entries(events).forEach(([type, eventList]) => {
    	eventList.forEach(event => {
     	 	const { startDate, endDate } = event;

			// Convert startDate, endDate back to date objects to compare
			const start = new Date(startDate.split("/").reverse().join("-"));
			const end = new Date(endDate.split("/").reverse().join("-"));
			const selected = new Date(props.selectedDate.date.split("/").reverse().join("-"));

			// Check if selected date is within event range
			if (selected >= start && selected <= end) {
				allEvents.push({ ...event, type });
			}
    	});
  	});

  	// Sort events by startTime (sorded by backend?)
  	return allEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// Selected date
const selectedDate = ref<CalendarDay>();

const eventClick = (eventData) => {
  	console.log("Clicked event:", eventData);
};

const props = defineProps({
  selectedDate: {
    type: Object,
  }
});

</script>
<template>
    <!-- Expandable Div -->
    <div
    :class="['expand-wrapper', isExpanded ? 'expanded' : 'minimized']"
    @click="toggleExpand"
    @touch="toggleExpand">
    <!-- ?fix later touch does not work well together with
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"> 
    -->
    
        <div class="line">
            <button class="expand-button">{{ isExpanded ? '▼' : '▲' }}</button>
        </div>
        <div class="event-selected-date">
            {{ props.selectedDate?.date }}
        </div>
        <div class="event-container">
            <ul v-if="getEventsForSelectedDate().length">
                <li v-for="(event, index) in getEventsForSelectedDate()" :key="index" class="event-item" @click.stop="eventClick(event)">
                    <div v-if="event.startDate !== event.endDate">
                        <div class="event-date-range">
                            {{ event.startDate }} - {{ event.endDate }}
                        </div>
                    </div>

                    <!-- Event circle and time -->
                    <div class="event-details" >
                        <div class="event-circle" :class="event.type"></div>
                        <span>{{ event.startTime }} - {{ event.endTime }} {{ event.title }}</span>
                    </div>
                </li>
            </ul>
        
            <p v-else>No events for this date... yet :P</p>
        </div>
    </div>
</template>

<style scoped>
ul {
  	padding-left: 0%;
  	padding-right: 0%;
}

button{
    background: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.expand-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    background-color: white;
    padding: 10px;
    padding-top: 20px;
    box-sizing: border-box;
    z-index: 3;
}

.expand-wrapper.minimized {
    top: auto;
    bottom: 0;
    height: calc(100vh - var(--calendar-bottom)); /* Calculate height */
}

.expand-wrapper.expanded {
    top: var(--calendar-top); /* Start at top calendar */
    bottom: 0;
    height: auto;
    z-index: 3;
}

.line {
    position: relative;
    width: 105%;
    left: -2.5%;
    height: 4px;
	margin-bottom: 20px;
    background-color: lightgrey;
    display: flex;
    justify-content: center;
    align-items: center;
}

.expand-button {
    position: absolute;
    top: -10px;
    padding: 5px 10px;
    z-index: 4;
}

.event-selected-date {
    position: absolute;
    top: 20px;
	left: 20px;
    font-size: 18px;
}
.event-container {
  	padding-bottom: 50px;
  	max-height: 90%;
  	overflow-y: auto;
}

.event-item {
  	display: flex;
  	flex-direction: column;
  	margin-bottom: 2px;
  	border: 1px solid black;
  	border-radius: 10px;
  	cursor: pointer;
}

.event-circle {
  	width: 12px;
  	height: 12px;
  	border-radius: 50%;
  	margin-right: 10px;
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

.event-date-range {
  	font-size: 12px;
  	margin-bottom: 5px;
  	text-align: left;
	padding-left: 11px;
}

.event-details {
  	display: flex;
  	align-items: center;
  	padding: 3px 10px;
}

.event-time {
  	display: flex;
  	flex-direction: column;
}
</style>