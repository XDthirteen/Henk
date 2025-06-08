// NTH: When returning to calendar return to same month that was open

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEvent } from '@/services/eventService'
import { fetchGroups } from '@/services/groupservices'
import StyledButton from '@/components/StyledButton.vue';

const route = useRoute();
const groups = ref<Group[]>([]);
const isEdit = ref(false)

const toUTCISOString = (dateStr: string, timeStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  const localDate = new Date(year, month - 1, day, hour, minute);
  return localDate.toISOString();
};

const preFillDoc = () => {
  const formatDate = (dateString :string):string => {
    const setDate = new Date(dateString);
    const yyyy = setDate.getFullYear();
    const mm = String(setDate.getMonth() + 1).padStart(2, '0');
    const dd = String(setDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

  // Edit event
  if (route.query.id) {
    if (typeof route.query.title === 'string') event.value.title = route.query.title;
    if (typeof route.query.description === 'string') event.value.description = route.query.description;
    if (typeof route.query.start === 'string') event.value.start = formatDate(route.query.start);
    if (typeof route.query.end === 'string') event.value.end = formatDate(route.query.end);
    if (typeof route.query.startTime === 'string') event.value.startTime = route.query.startTime;
    if (typeof route.query.endTime === 'string') event.value.endTime = route.query.endTime;
    if (typeof route.query.groupId === 'string') event.value.groupId = route.query.groupId;
  };

  // Add event
  if (typeof route.query.selectedDate === 'string') {
    // Pre fill date with selected date
    const formattedDate = formatDate(route.query.selectedDate);
    event.value.start = formattedDate;
    event.value.end = formattedDate;

    // set current group calendar as default to add a event
    if (typeof route.query.group_id === 'string') {
      if (route.query.group_id === 'personal') {
        const defaultGroup = groups.value.find(group => group.defaultGroup);
        if (defaultGroup) {
          event.value.groupId = String(defaultGroup.id);
        };
      }
      else {
        event.value.groupId = route.query.group_id;
      };
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

const router = useRouter()

interface EventFormData {
  title: string
  groupId: string
  start: string
  startTime: string
  end: string
  endTime: string
  description: string
  allDay?: boolean
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


onMounted(async () => {
  try {
    groups.value = await fetchGroups();
    isEdit.value = Boolean(route.query.id);
    preFillDoc();
  } catch (error) {
    alert('Failed to load groups: ' + error);
  };
});

// go back to last open group/personal calendar
const returnToCalendar = () => {
  const query: { group_id?: string } = {};

  if (typeof route.query.group_id === 'string') query.group_id = route.query.group_id;

  router.push({
    name: 'calendar',
    query,
  });
};

const submitEvent = async () => {
  try {
    const eventToSend = {
      title: event.value.title,
      groupId: event.value.groupId,
      start: toUTCISOString(event.value.start, event.value.allDay ? '00:00' : event.value.startTime),
      end: toUTCISOString(event.value.end, event.value.allDay ? '23:59' : event.value.endTime),
      description: event.value.description,
    };

    if (isEdit.value){
      console.log("EDIT MODE"); // add api call in branch api-service-refactor
    }
    else {
      await createEvent(eventToSend);
    };

    alert('Event added');
    returnToCalendar();
  } catch (error) {
    console.error('Failed to create event:', error);
    alert('Failed to create event');
  };
};
</script>

<template>
  <div class="calendar-events">
    <div class="events-content">

      <h2>{{ isEdit ? 'Edit an event' : 'Create a new event' }}</h2>

      <form @submit.prevent="submitEvent">
        <div>
          <label for="eventTitle">Title event</label>
          <input v-model="event.title" id="eventTitle" type="text" required>
        </div>

      <div>
        <label for="eventGroupId">Group</label>
        <select v-model="event.groupId" id="eventGroupId" required>
          <option v-for="group in groups" :value="group.id" :key="group.id">
            {{ group.defaultGroup ? 'Personal' : group.name }}
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
        <StyledButton buttonTypeHTML="submit" type="save">Save</StyledButton>
        <StyledButton buttonTypeHTML="reset" type="negative" @click="returnToCalendar">Go Back to Calendar</StyledButton>
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
