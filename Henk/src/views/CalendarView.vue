<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Reactive states for the current year and month
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// Weekdays and months constants
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

// Generate the days for the calendar grid
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // Sunday = 0
  const lastDayOfWeek = new Date(year, month + 1, 0).getDay(); // Sunday = 0

  const days = [];

  // Previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // -1 for Monday start
  for (let i = startOffset; i > 0; i--) {
    days.push({
      day: daysInPrevMonth - i + 1,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      faded: true,
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
        day,
        month,
        year,
        faded: false,
        isToday:day === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth(),
    });
  }

  // Next month
  const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  for (let i = 1; i <= endOffset; i++) {
    days.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      faded: true,
    });
  }

  return days;
});

// Nav buttons to change the month
const goToPrevMonth = () => {
  currentMonth.value--;
  if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  }
};

const goToNextMonth = () => {
  currentMonth.value++;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  }
};

onMounted(() => {
  console.log("Calendar component mounted");
});
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="goToPrevMonth" class="nav-button">◀</button>
      <span id="month-year">{{ months[currentMonth] }} {{ currentYear }}</span>
      <button @click="goToNextMonth" class="nav-button">▶</button>
    </div>
    
    <div class="calendar-grid">
      <!-- Weekdays -->
      <div v-for="weekday in weekdays" :key="weekday" class="day">
        {{ weekday }}
      </div>

      <!-- Calendar Days -->
      <div
        v-for="(date, index) in calendarDays"
        :key="`${date.day}-${date.month}-${date.year}`"
        :class="['date', { faded: date.faded, today: date.isToday }]"
        @click="console.log(`Clicked on date: ${date.day}-${date.month + 1}-${date.year}-${date.weekday}`)"
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
        gap: 1px;
        background: white;
        overflow-y: auto;
        max-height: 380px;
        /* Adjust height to fit 5-6 rows */
        flex-grow: 1;
        /* Allow it to grow but stay within the fixed height */
    }

    .day,
    .date {
        padding: 30%;
        text-align: center;
        font-size: 14px;
        color: black;
    }

    .date {
        cursor: pointer;
    }

    .date:hover {
        border: 1px solid black;
    }

    .today {
        background: grey;
        color: white;
        font-weight: bold;
    }

    .faded {
        color: #aaa;
    }
</style>