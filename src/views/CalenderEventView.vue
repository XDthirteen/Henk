<script setup lang="ts">
import{ ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  defaultLocation: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const event = ref({
  title: '',
  time: '',
  location: props.defaultLocation,
  notes: '',
  date: new Date().toISOString().split('T')[0],
});

watch(() => props.defaultLocation, (newLocation) => {
  event.value.location = newLocation;
});

const closeModal = () => {
  emit('close');
};

const submitEvent = () => {
  console.log('Event Created:', event.value);
  closeModal();
};

</script>


<template>
<div v-if="isVisible" class="calendar-events" @click.self="closeModal">
  <div class="events-content">

    <h2>Create a new event</h2>

  <form @submit.prevent="submitEvent">
    <div>
      <label for="eventTitle">Title event</label>
      <input v-model="event.title" id="eventTitle" type="text" required>
    </div>

  <div>
    <label for="eventTime">Time event</label>
    <input v-model="event.time" id="eventTime" type="time" required>
  </div>

  <div>
    <label for="eventLocation">Location event</label>
    <input v-model="event.location" id="eventLocation" type="text" disabled>
  </div>

  <div>
    <label for="eventNotes">Note event</label>
    <textarea v-model="event.notes" id="eventNotes" placeholder="Add notes..."></textarea>
  </div>


  <div class="event-buttons">
    <button type="button" @click="closeModal">Cancel</button>
    <button type="submit">Save</button>
  </div>
  </form>
</div>
</div>
</template>

<style scoped>
.calendar-events {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.events-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
}

.event-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #453d83;
  color: white;
}

button[type='button'] {
  background-color: #f44336;
  color: white;
}
label {
  padding-right: 5px;
}
</style>
