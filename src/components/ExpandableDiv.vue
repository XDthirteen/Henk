/*#####################################
/      
/      #  CalendarView.vue
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Overzichtelijkere code. Component voor div's groter en kleiner te maken in calendar. 
/ 
/      #  Auteur: Jorn Vierbergen
/      #  Datum aangemaakt: 13/02/2025
/
#################
/
/      Changelog:
/      ----------
/      13/02/2025 - Jorn Vierbergen
/          - Aangepast: expandable div verplaatst naar component ExpandableDiv.vue
/      28/02/2025 - Jorn Vierbergen
/          - Aangepast: selected date met props doorgeven
/
/      To do:
/      - See CalendarView.vue
/
/      Opmerkingen:
/      ------------
/      Enige opmerkingen?
/      
#####################################*/

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import { swipe } from '@/services/swipeDetection.service.ts';

const { onTouchStart, onTouchEnd } = swipe();

const props = defineProps({
	events: {
		type: Array,
		default: () => [],
	},
	selectedDate: {
		type: Object,
		default: () => null,
	},
});

// Expandable div toggle
const isExpanded = ref(false);
const toggleExpand = () => {
  	isExpanded.value = !isExpanded.value;
};

// Selected date event data
const getEventsForSelectedDate = computed(() => {
	if (props.selectedDate?.events) {
		return props.selectedDate.events
  	}
  	return [];
});

const eventClick = (eventData) => {
  	console.log("Clicked event:", eventData);
    console.log("x",props.selectedDate)
};

</script>
<template>
    <!-- Expandable Div -->
    <div
    :class="['expand-wrapper', isExpanded ? 'expanded' : 'minimized']"
    @click="toggleExpand"
    @touch="toggleExpand"
    @touchstart="onTouchStart"
    @touchend="(event) => {
        const direction = onTouchEnd(event);
        if (direction === 'up') isExpanded = true;
        if (direction === 'down') isExpanded = false;
        console.log('Swiped:', direction, 'isExpanded:', isExpanded);
    }"
    >
    
        <div class="line">
            <button class="expand-button">{{ isExpanded ? '▼' : '▲' }}</button>
        </div>
        <div class="event-selected-date">
            {{ props.selectedDate?.convertedDate }}
        </div>
        <div class="event-container">
            <ul v-if="getEventsForSelectedDate.length">
                <li v-for="(event, index) in getEventsForSelectedDate" :key="index" class="event-item" @click.stop="eventClick(event)">
                    <div v-if="event.startDate !== event.endDate">
                        <div class="event-date-range">
                            {{ event.startDate }} - {{ event.endDate }}
                        </div>
                    </div>

                    <!-- Event circle and time -->
                    <div class="event-details" >
                        <div class="event-circle" :class="event.eventType"></div>
                        <span>{{ event.startTime }} - {{ event.endTime }} {{ event.groupId }} {{ event.title }}</span>
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
    height: calc(100dvh - var(--calendar-bottom)); /* Calculate height */
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