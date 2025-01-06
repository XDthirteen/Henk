<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Test data for events
const eventDates = {
  personal: ["7-1-2025", "9-1-2025"],
  group: ["10-1-2025", "9-1-2025"],
  planned: ["17-1-2025", "29-1-2025"],
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

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  faded: boolean;
  isToday?: boolean;
  dayOfWeek: string;
}

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const lastDayOfWeek = new Date(year, month + 1, 0).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

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

      days.push({
        day: targetDate.getDate(),
        month: targetMonth,
        year: targetYear,
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

  const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
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

const getDayEvent = (date: CalendarDay): string[] => {
  const dateStr = `${date.day}-${date.month + 1}-${date.year}`;
  const classes: string[] = [];

  if (eventDates.personal.includes(dateStr)) {
    classes.push("personal");
  }
  if (eventDates.group.includes(dateStr)) {
    classes.push("group");
  }
  if (eventDates.planned.includes(dateStr)) {
    classes.push("planned");
  }

  return classes;
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
        :key="`${date.day}-${date.month}-${date.year}`"
        :id="`${date.day}-${date.month + 1}-${date.year}`"
        :class="['date', { faded: date.faded, today: date.isToday }, ...getDayEvent(date)]"
        @click="console.log(`Clicked on: ${date.day}-${date.month + 1}-${date.year} (${date.dayOfWeek})`)"
      >
        {{ date.day }}
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

    .date:hover {
        border: 2px solid black;
    }

    .today {
        background: grey;
        color: white;
        font-weight: bold;
    }

    .date.personal::after,
.date.group::after,
.date.planned::after {
  content: "";
  position: absolute;
  bottom: 5px; /* Line position */
  left: 10%; /* Line width adjustment */
  right: 10%; /* Line width adjustment */
  height: 3px; 
  border-radius: 2px;
}


.date.personal::after {
  background-color: #ff6b6b; 
}

.date.group::after {
  background-color: #4ecdc4;
}

.date.planned::after {
  background-color: #1a73e8; 
}

    .faded {
        color: #aaa;
    }
</style>