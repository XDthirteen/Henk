/*#####################################
/
/ # EventPopup.vue
/ # ==================
/ # Description:
/ # ------------
/ # Popup for showing event details in calendarView.vue when clicked on a event.
/
/ # Author: Jorn Vierbergen
/ # Creation date: 23/05/2025
/
#################
/
/ Changelog:
/ ----------
/ 02/06/2025 - Jorn Vierbergen
/ - Edited: Same size buttons, and move cancel button on small screen
/ - Edited: House style colors
/
/ To do:
/
/ Comments:
/ ------------
/ None
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiService, isApiError } from "@/services/api.service";
import StyledButton from "@/components/StyledButton.vue";
import PopUpComponent from "@/components/PopUpComponent.vue";
import ConfirmPopup from "@/components/popups/ConfirmationPopup.vue";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import type { CalendarEvent } from "@/components/models";

const { deleteData } = apiService();
const router = useRouter();

const props = defineProps<{ event: CalendarEvent }>();
const emit = defineEmits(['close']);

const showConfirmPopup = ref(false);
const showMessagePopup = ref(false);
const showErrorPopup = ref(false);
const errorMessage = ref<string>('');
const errorStatus = ref<string | number | null>(null);

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

const deleteEvent = async () => {
  const data = await deleteData(`/api/events/${props.event.id}`);
  if (isApiError(data)) {
    // if an error occures you can set a specific error message/popup per error.status for the user here
    // use error popup component when merged with main
		console.error(`${data.status} ${data.message}`);
    errorStatus.value = data.status
    errorMessage.value = data.message;
    showErrorPopup.value = true;
		return;
	}

  showConfirmPopup.value = false;
  showMessagePopup.value = true;
};

function handleConfirmation(confirmed: boolean) {
  if (confirmed) deleteEvent();
  showConfirmPopup.value = false;
};

const viewCalendar = () => {
  const query = { ...router.currentRoute.value.query };
  query.reload = Date.now().toString(); // Always unique to refresh
  router.push({ name: 'calendar', query: query });
  emit('close')
};

</script>

<template>
  <PopUpComponent @close="emit('close')">
    <div class="event-popup">
      <div class="event-title">{{ event.title }}</div>
      <div class="event-group">{{ event.displayName }}</div>
      <div class="event-date">{{ event.startDate }} {{ event.startTime }}</div>
      <div class="event-date">{{ event.endDate }} {{ event.endTime }}</div>

      <div class="event-description">
        <div>{{ event.description }}</div>
      </div>

      <div class="btn-container">
        <StyledButton @click="editEvent" type="save">Edit</StyledButton>
        <StyledButton @click="emit('close')" type="primary">Cancel</StyledButton>
        <StyledButton @click="showConfirmPopup = true" type="negative">Delete</StyledButton>
      </div>
    </div>
  </PopUpComponent>

  <!-- Confirm Delete -->
  <ConfirmPopup v-if="showConfirmPopup "@confirmed="handleConfirmation">
    <div class="popup-wrapper">
      <p>Are you sure you want to delete the event:</p>
      <p class="event-group">{{ event.title }}</p>
    </div>
  </ConfirmPopup>

  <!-- Event Deleted Message -->
  <MessagePopup v-if="showMessagePopup" @close="viewCalendar">
    <p>Event deleted</p>
  </MessagePopup>

    <!-- Error Message -->
  <MessagePopup v-if="showErrorPopup" @close="emit('close')">
    <p>Unable to delete event.</p>
    <p v-if="errorStatus !== null">Status: {{ errorStatus }}</p>
    <p>Message: {{ errorMessage }}</p>
  </MessagePopup>
  
</template>

<style scoped>
.popup-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0 10px;
}

.event-popup {
  height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  word-break: break-word;
}

.event-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.event-group {
  font-weight: 600;
}

.event-date {
  margin: 0;
}

.event-description {
  flex-grow: 1;
  overflow-y: auto;
  background-color: var(--event-background);
  padding: 10px;
  border-radius: 8px;
  word-break: break-word;
}

.btn-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}

/* select all child components */
.btn-container > * {
  flex: 1 1 100px;
  max-width: 120px;
}

/* Cancel button full width and center on small screens */
@media (max-width: 390px) {
  .btn-container {
    flex-direction: row;
  }

  .btn-container > :nth-child(2) { /* Cancel button */
    flex-basis: 100%;
    max-width: none;
    order: 3;
    text-align: center;
  }
}
</style>
