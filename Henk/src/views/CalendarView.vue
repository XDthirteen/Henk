<script setup lang="ts">
import type { CalendarDay } from "@/components/models";
import { ref, computed, onMounted } from "vue";

// Test data for events
const eventDates = {
  personal: ["2-1-2025","29-1-2025", "18-1-2025"],
  group: ["7-1-2025","10-1-2025", "29-1-2025","8-1-2025"],
  planned: ["7-1-2025","17-1-2025", "29-1-2025", "8-1-2025"],
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
      const fullDate = `${targetDate.getDate()}-${targetMonth + 1}-${targetYear}`;

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
      });
    }
  };


  const daysInPrevMonth = new Date(year, month, 0).getDate();
  addDays(startOffset, daysInPrevMonth - startOffset + 1, true, -1);
  addDays(daysInMonth, 1, false, 0);
  addDays(endOffset, 1, true, 1);

  return days;
});

const goToPrevMonth = () => {
  currentMonth.value = (currentMonth.value - 1 + 12) % 12;
  if (currentMonth.value === 11) currentYear.value--;
};

const goToNextMonth = () => {
  currentMonth.value = (currentMonth.value + 1) % 12;
  if (currentMonth.value === 0) currentYear.value++;
};

onMounted(() => console.log("Loaded"));
</script>


<template>
  <div class="calendar">
    <!-- Header -->
    <div class="calendar-header">
      <button @click="goToPrevMonth" class="nav-button">◀</button>
      <span id="month-year">{{ months[currentMonth] }} {{ currentYear }}</span>
      <button @click="goToNextMonth" class="nav-button">▶</button>
    </div>

    <!-- :key for efficiently rendering DOM through VUE -->
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
        :class="['date', {faded: date.faded, today: date.isToday}]"
        @click="console.log(`Clicked on: ${date.date} (${date.dayOfWeek})`)"
      >
        <span>{{ date.day }}</span>
        <div class="event-lines">
          <div
            class="event-line personal"
            v-if="eventDates.personal.includes(`${date.date}`)"
          ></div>
          <div
            class="event-line group"
            v-if="eventDates.group.includes(`${date.date}`)"
          ></div>
          <div
            class="event-line planned"
            v-if="eventDates.planned.includes(`${date.date}`)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: baseline;
        height: 100vh;
        margin: 0;
        background-color: #f4f4f4;
    }

    .calendar {
        width: 350px;
        background: white;
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
        color: #fff;
    }

    #month-year{
        justify-content: center;
        align-items: center;
    }
    
    .nav-button {
        background: #007BFF;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .nav-button:hover {
        background: #0056b3;
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

    .date span{
        position: relative;
        z-index: 2;
        top: -8px;
    }

    .date:hover {
        border: 2px solid black;
    }

    .today {
        background: grey;
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
}

.event-line.personal {
  bottom: 9px;
  background-color: red;
}

.event-line.group {
  bottom: 5px;
  background-color: green;
}

.event-line.planned {
  bottom: 1px;
  background-color: blue;
}

</style>
