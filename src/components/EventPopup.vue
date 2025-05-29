/*#####################################
/
/ # EventPopup.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Popup for showing event details in calendarView.vue when clicked on a event.
/
/ # Auteur: Jorn Vierbergen
/ # Datum aangemaakt: 23/05/2025
/
#################
/
/ Changelog:
/ ----------
/ 23/05/2025 - Jorn Vierbergen
/ - Added: everything?
/
/ To do:
/ - change colors after merge with main, new colors and theme available
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { apiService, isApiError } from "@/services/api.service";
import StyledButton from "@/components/StyledButton.vue";
import type { CalendarEvent } from "@/components/models";

const { deleteData } = apiService();
const router = useRouter();

const props = defineProps<{ event: CalendarEvent }>();

// return to view to create event, but pre fill the doc + set to edit instead of create
const editEvent = () => {
  if (!props.event) return;

  const eventDataString = JSON.stringify(props.event);

  router.push({
    name: 'calenderEvents',
    query: {
      eventData: eventDataString,
    },
  });
};

const deleteEvent = async (eventId: number) => {
  const deleted = await deleteData(`/api/events/${eventId}`);
  if (isApiError(deleted)) {
    // if an error occures you can set a specific error message/popup per error.status for the user here
    // use error popup component when merged with main
		console.error(`${deleted.status} ${deleted.message}`);
		return;
	}
  console.log(deleted.message)
	// Event deleted successfully
};
</script>

<template>
  <div class="event-popup">
    <div class="event-title">{{ event.title }}</div>
    <div class="event-group">{{ event.displayName }}</div>
    <div class="event-date">{{ event.startDate }} {{ event.startTime }}</div>
    <div class="event-date">{{ event.endDate }} {{ event.endTime }}</div>

    <div class="event-description">
      <div>{{ event.description }}</div>
    </div>

    <div class="btn-container">
      <StyledButton @click="editEvent()" type="save">Edit</StyledButton>
      <StyledButton @click="deleteEvent(event.id)" type="negative">Delete</StyledButton>
    </div>
  </div>
</template>

<style scoped>
.event-popup {
  width: 100%;
  height: 400px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  gap: 10px;
  box-sizing: border-box;
  overflow: hidden;
  word-break: break-word;
}

.event-title {
  font-size: 1.5rem;
  font-weight: 600;
  word-break: break-word;
}

.event-group {
  font-weight: 600;
  word-break: break-word;
}

.event-date {
  margin: 0;
}

.event-description {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #dbd6d6;
  padding: 10px;
  border-radius: 8px;
  word-break: break-word;
}

.event-description p {
  margin: 0;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}
</style>
