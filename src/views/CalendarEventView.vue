<script setup lang="ts">
import{ ref } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  defaultLocation: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

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

// watch(() => props.defaultLocation, (newLocation) => {
//   event.value.location = newLocation;
// });

const closeModal = () => {
  emit('close');
};

const submitEvent = () => {
  console.log('Event Created:', event.value);
  // TODO: call create event from the service as well
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
    <label for="eventGroupId">Time event</label>
    <select v-model="event.groupId" id="eventGroupId" type="" required>
      <option disabled value="">Please select one</option>
      <option v-for="group in groups" :value="group.id" :key="group.id">
        {{ group.name }}
      </option>
    </select>
  </div>

  <div>
    <label for="eventStart">Time event</label>
    <input v-model="event.start" id="eventStart" type="date" required>
  </div>

  <div>
    <label for="eventEnd">Time event</label>
    <input v-model="event.end" id="eventEnd" type="date" required>
  </div>

  <div>
    <label for="eventDescription">Note event</label>
    <textarea v-model="event.description" id="eventDescription" placeholder="Add notes..."></textarea>
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
  z-index: 4;
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
