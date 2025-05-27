<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createEvent } from '@/services/eventService'
import { fetchGroups } from '@/services/groupservices'
import StyledButton from '@/components/StyledButton.vue';


const router = useRouter()

interface EventFormData {
  title: string
  groupId: string
  start: string
  startTime: string
  end: string
  endTime: string
  description: string
  allDay: boolean
}

const event = ref<EventFormData>({
  title: '',
  groupId: '',
  start: new Date().toISOString().split('T')[0],
  startTime: '',
  end: new Date().toISOString().split('T')[0],
  endTime: '',
  description: '',
  allDay: false,
})

const groups = ref([])

onMounted(async () => {
  try {
    groups.value = await fetchGroups()
  } catch (error) {
    alert('Failed to load groups:', error)
  }
})

const returnToCalendar = () => {
  router.push({ name: 'calendar' })
}

const submitEvent = async () => {
  try {
    const eventToSend = {
      title: event.value.title,
      groupId: event.value.groupId,
      start: event.value.allDay
        ? event.value.start
        : `${event.value.start}T${event.value.startTime || '00:00'}`,
      end: event.value.allDay
        ? event.value.end
        : `${event.value.end}T${event.value.endTime || '23:59'}`,
      description: event.value.description,
    }

    await createEvent(eventToSend)

    alert('Event added')
    returnToCalendar()
  } catch (error) {
    console.error('Failed to create event:', error)
    alert('Failed to create event')
  }
}
</script>

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
  <label for="eventStartTime">Start time</label>
  <input v-model="event.startTime" :disabled="event.allDay" id="eventStartTime" type="time" />
</div>

  <div>
    <label for="eventEnd">End date</label>
    <input v-model="event.end" id="eventEnd" type="date" required>
  </div>

  <div>
  <label for="eventEndTime">End time</label>
  <input v-model="event.endTime" :disabled="event.allDay" id="eventEndTime" type="time" />
  </div>

  <div>
  <label for="eventAllDay">All day</label>
  <input v-model="event.allDay" id="eventAllDay" type="checkbox" />
  </div>

  <div>
    <label for="eventDescription">Notes</label>
    <textarea v-model="event.description" id="eventDescription" placeholder="Add notes..." rows="4" cols="30"></textarea>
  </div>

  <div class="event-buttons">
    <StyledButton type="save">Save</StyledButton>
    <StyledButton type="negative" @click="returnToCalendar">Go Back to Calendar</StyledButton>
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

label {
  padding-right: 10px;
  display: flex;
}
</style>
