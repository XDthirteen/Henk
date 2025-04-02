<script setup lang="ts">
import{ ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const event = ref({
  title: '',
  groupId: '',
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0],
  // location: props.defaultLocation,
  description: '',
});

// TODO: get the groups from the group service
const groups = ref([
  {
    id: "alaa",
    name: "alaa",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-02"
  },
  {
    id: "gert-jan",
    name: "gert-jan",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-02"
  },
])

const returnToCalendar = () => {
  router.push({ name: 'calendar' })
};

const submitEvent = () => {
  console.log('Event Created:', event.value);
    // TODO: call create event from the service as well
  document.createEvent("Event")
  returnToCalendar()
};

</script>

//TODO: Time + button for whole day

<template>
  <div class="calendar-events">
  <div class="events-content">

    <h2>Create a new event</h2>

  <form @submit.prevent="submitEvent">
    <div>
      <label for="eventTitle">Title event</label>
      <input v-model="event.title" id="eventTitle" type="text" required>
    </div>

  <div>
    <label for="eventGroupId">Group</label>
    <select v-model="event.groupId" id="eventGroupId" type="" required>
      <option disabled value="">Please select one</option>
      <option v-for="group in groups" :value="group.id" :key="group.id">
        {{ group.name }}
      </option>
    </select>
  </div>

 <div>
    <label for="eventStart">Start date</label>
    <input v-model="event.start" id="eventStart" type="date" required>
  </div>

  <div>
    <label for="eventTime">Start time</label>
    <input v-model="event.time" id="eventTime" type="time">
  </div>

  <div>
    <label for="eventEnd">End date</label>
    <input v-model="event.end" id="eventEnd" type="date" required>
  </div>

  <div>
    <label for="eventTime">End time</label>
    <input v-model="event.time" id="eventTime" type="time">
  </div>

  <div>
    <label for="eventAllDay">All day</label>
    <input type="checkbox">
  </div>

  <div>
    <label for="eventDescription">Notes</label>
    <textarea v-model="event.description" id="eventDescription" placeholder="Add notes..." rows="4" cols="30"></textarea>
  </div>

  <div class="event-buttons">
    <button type="submit" onclick="alert('Event added')">Save</button>
    <button type="button" @click="returnToCalendar">Go Back to Calendar</button>
  </div>
  </form>
</div>
</div>
</template>

<style scoped>
.calendar-events {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  width: 100%;
}

.events-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  background-color: #5f55af;
  color: #e9f3fe;
}

.event-buttons {
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

button[type='submit'] {
  background-color: #453d83;
  color: white;
  width: 160px;
}

button[type='button'] {
  background-color: #f44336;
  color: white;
  display: flex;
  width: 160px;
}

label {
  padding-right: 10px;
  display: flex;
}
</style>
