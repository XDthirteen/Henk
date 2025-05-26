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
/ - Added: 
/
/ To do:
/
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { eventService } from "@/services/event.service.ts";
import type { CalendarDay, CalendarEvent } from "@/components/models";
import StyledButton from "@/components/StyledButton.vue";

const { deleteData } = eventService();
const router = useRouter();

const props = defineProps<{ event: CalendarEvent }>();

const editEvent = () => {
  console.log("eeee", props.event)
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
  const deleted = await deleteData(`events/${eventId}`);
  console.log(deleted.message)
	// Event deleted successfully
};
</script>

<template>
  <div class="event-popup">
    <h2>{{ event.title }}</h2>
    <p>{{ event.startTime }} - {{ event.endTime }}</p>
    <p>{{ event.eventType }}</p>
    <p>{{ event.displayName }}</p>
    <div class="btn-container">
      <StyledButton @click="editEvent" type="save">Edit</StyledButton>
      <StyledButton @click="deleteEvent(event.id)" type="negative">Delete</StyledButton>
    </div>
  </div>
</template>

<style scoped>
.event-popup {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
