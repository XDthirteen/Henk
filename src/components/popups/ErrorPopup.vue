/*#####################################
/
/ # ErrorPopup.vue
/ # ==================
/ # Description:
/ # ------------
/ # Default popup to display errors.
/ # Emits 'close' to parent file upon clicking 'ok', clicking outside the popup or when closing the popup.
/
/ # Author: Jorn Vierbergen
/ # Creation date: 08/06/2025
/
#################
/
/ Changelog:
/ ----------
/
/ 
/ To do:
/ 
/ Comments:
/ ------------
/ None
/ 
#####################################*/
<script setup lang="ts">
import PopUpComponent from '@/components/PopUpComponent.vue';
import StyledButton from '@/components/StyledButton.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

defineProps<{
  errorExplanation?: string;
  errorStatus?: number | null;
  errorMessage?: string;
}>();

const emit = defineEmits(['close']);

function closePopup() {
  emit('close');
};
</script>

<template>
  <PopUpComponent @close="closePopup">
    <ErrorMessage>
    <div class="popup">
      <p v-if="errorExplanation">{{ errorExplanation }}</p>
      <p v-if="errorStatus !== null">Status: {{ errorStatus }}</p>
      <p v-if="errorMessage">Error: {{ errorMessage }}</p>

      <div class="btn-container">
        <StyledButton @click="closePopup" type="primary">ok</StyledButton>
      </div>
    </div>
    </ErrorMessage>
  </PopUpComponent>
</template>

<style scoped>
.popup {
  margin-top: 1rem;
  text-align: center;
}

.btn-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

/* select all child components */
.btn-container > * {
  flex: 1;
  max-width: 100px;
}
</style>
