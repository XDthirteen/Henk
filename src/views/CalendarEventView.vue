<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEvent } from '@/services/eventService'
import { fetchGroups } from '@/services/groupservices'

// ADDED by Jorn
import type { CalendarDay, CalendarEvent } from "@/components/models";

const route = useRoute();
const selectedDate = ref<CalendarDay | null>(null);


const preFillDoc = () => {
  // default data for adding events faster on the selected day
  if (route.query.groupAgenda && typeof route.query.groupAgenda === 'string') {
    // Pre-fill groupId with data from selected date
    // Needs work on 'personal' group
    event.value.groupId = route.query.groupAgenda;
  };

  if (route.query.selectedDate) {
    selectedDate.value = JSON.parse(route.query.selectedDate as string) as CalendarDay;
    console.log('SelectedDay data:', selectedDate.value);

    if (selectedDate.value.date) {
      const setDate = new Date(selectedDate.value.date);
      const yyyy = setDate.getFullYear();
      const mm = String(setDate.getMonth() + 1).padStart(2, '0');
      const dd = String(setDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Pre-fill start and end date with data from selected date
      event.value.start = formattedDate;
      event.value.end = formattedDate;
    };
  };
};

  interface Group {
  id: number;
  name: string;
  image?: string;
  defaultGroup: boolean;
  createdAt: string;
  updatedAt: string;
};
// END

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

// EDITED by Jorn
//const groups = ref([])
const groups = ref<Group[]>([]);

onMounted(async () => {
  try {
    groups.value = await fetchGroups()
  } catch (error) {
    alert('Failed to load groups: ' + error)
  }
  // ADDED by Jorn
  preFillDoc()
  // END
})

const returnToCalendar = () => {
  // EDITED by Jorn
  //router.push({ name: 'calendar' })
  // ADDED by Jorn
  const query: { group_id?: string } = {};

  // Use selected group
  if (event.value.groupId) {
    query.group_id = event.value.groupId;
  };

  router.push({
    name: 'calendar',
    query,
  });
  // END
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
      <!-- EDITED by Jorn -->
      <!--<select v-model="event.groupId" id="eventGroupId" type="" required>-->
      <select v-model="event.groupId" id="eventGroupId" required>
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
    <button type="submit">Save</button>
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
