/*#####################################
/
/ # ConfirmationPopup.vue
/ # ==================
/ # Description:
/ # ------------
/ # Default popup for confirming or canceling an action.
/ # Emits 'confirmed' as a boolean value to parent file.
/
/ # Author: Jorn Vierbergen
/ # Creation date: 30/05/2025
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

const emit = defineEmits(['confirmed']);

function closePopup() {
  emit('confirmed', false);
};

function confirm() {
  emit('confirmed', true);
};
</script>

<template>
  <PopUpComponent @close="closePopup">
    <div class="popup">
      <slot/>
      <div class="btn-container">
        <StyledButton @click="confirm" type="primary">Confirm</StyledButton>
        <StyledButton @click="closePopup" type="primary">Cancel</StyledButton>
      </div>
    </div>
  </PopUpComponent>
</template>

<style scoped>
.popup {
  margin-top: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.btn-container {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

/* select all child components */
.btn-container > * {
  flex: 1;
  max-width: 100px;
}
</style>
