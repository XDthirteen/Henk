/*#####################################
/
/ # ExpandableDiv.vue
/ # ==================
/ # Description:
/ # ------------
/ # Better overview of code. Component for making div bigger an smaller in calendar.
/
/ # Author: Jorn Vierbergen
/ # Creation date: 13/02/2025
/
#################
/
/ Changelog:
/ ----------
/ 13/02/2025 - Jorn Vierbergen
/ - Edited: expandable div moved to component ExpandableDiv.vue
/ 28/02/2025 - Jorn Vierbergen
/ - Edited: selected date with props data exchange
/ 23/05/2025 - Jorn Vierbergen
/ - Edited: Display name of group instead of ID
/
/ To do:
/
/ Comments:
/ ------------
/ None
/
#####################################*/

<script setup lang="ts">
import { ref, computed } from "vue";
import { swipe } from '@/utils/swipeDetection';
import EventPopup from '@/components/popups/EventPopup.vue';
import type { CalendarDay, CalendarEvent } from "@/components/models";

const { onTouchStart, onTouchEnd } = swipe();

// Popup
const selectedEvent = ref(null);
const showEventPopup = ref(false);

const props = defineProps<{
  events: CalendarEvent[];
  selectedDate: CalendarDay | null;
}>();

// Expandable div toggle
const isExpanded = ref(false);
const toggleExpand = (): void => {
  isExpanded.value = !isExpanded.value;
};

// Selected date event data
const getEventsForSelectedDate = computed(() => {
  if (props.selectedDate?.events) {
    return props.selectedDate.events
  }
  return [];
});

const eventClick = (eventData: any): void => {
  console.log("Clicked event:", eventData);
  console.log("x",props.selectedDate)
  selectedEvent.value = eventData;
  showEventPopup.value = true;
};

const closeEventPopup = (): void => {
  selectedEvent.value = null;
  showEventPopup.value = false;
};

</script>

<template>
  <!-- Expandable Div -->
  <div :class="['expand-wrapper', isExpanded ? 'expanded' : 'minimized']" @click="toggleExpand" @touch="toggleExpand"
    @touchstart="onTouchStart" @touchend="(event) => {
      const direction = onTouchEnd(event);
      if (direction === 'up') isExpanded = true;
      else if (direction === 'down') isExpanded = false;
    }">

    <div class="line">
      <button class="expand-button">{{ isExpanded ? '▼' : '▲' }}</button>
    </div>
    <div class="event-selected-date">
      {{ props.selectedDate?.date }}
    </div>
    <div class="event-container">
      <ul v-if="getEventsForSelectedDate.length">
        <li v-for="(event, index) in getEventsForSelectedDate" :key="index" class="event-item"
          @click.stop="eventClick(event)">
          <div v-if="event.startDate !== event.endDate">
            <div class="event-date-range">
              {{ event.startDate }} - {{ event.endDate }}
            </div>
          </div>

          <!-- Event circle and time -->
          <div class="event-details">
            <div class="event-circle" :class="event.eventType"></div>
            <span>{{ event.startTime }} - {{ event.endTime }} {{ event.displayName }} {{ event.title }}</span>
          </div>
        </li>
      </ul>

      <p v-else>Nothing planned on this day.</p>
    </div>
  </div>

  <EventPopup v-if="selectedEvent" :event="selectedEvent" @close="closeEventPopup"/>
</template>

<style scoped>
ul {
  padding-left: 0%;
  padding-right: 0%;
}

button {
  background: var(--primary-button);
  color: var(--main-text);
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.expand-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  background-color: var(--main-background);
  padding: 10px;
  padding-top: 20px;
  box-sizing: border-box;
  z-index: 3;
}

.expand-wrapper.minimized {
  top: auto;
  bottom: 0;
  height: calc(100dvh - var(--calendar-bottom));
  /* Calculate height */
}

.expand-wrapper.expanded {
  top: var(--calendar-top);
  /* Start at top calendar */
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
  background-color: var(--main-red);
  display: flex;
  justify-content: center;
  align-items: center;
}

.expand-button {
  color: var(--main-text);
  position: absolute;
  top: -10px;
  padding: 5px 10px;
  z-index: 4;
}

.event-selected-date {
  color: var(--black-text);
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
}

.event-container {
  color: var(--black-text);
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
  background: var(--event-background);
  color: var(--main-text);
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

.task {
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
