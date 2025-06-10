/*#####################################
/
/ # MessagePopup.vue
/ # ==================
/ # Description:
/ # ------------
/ # Default popup to display a message.
/ # Emits 'close' to parent file upon clicking 'ok', clicking outside the popup or when closing the popup.
/
/ # Author: Jorn Vierbergen
/ # Creation date: 30/05/2025
/
#################
/
/ Changelog:
/ ----------
/ 02/06/2025 - Jorn Vierbergen
/ - Edited: Same size buttons 
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
import StyledButton from "@/components/StyledButton.vue";

const emit = defineEmits(['close']);

function closePopup() {
  emit('close');
}
</script>

<template>
  <PopUpComponent @close="closePopup">
    <div class="message-popup">
      <slot />
      <div class="btn-container">
        <StyledButton @click="closePopup" type="primary">ok</StyledButton>
      </div>
    </div>
  </PopUpComponent>
</template>

<style scoped>
.message-popup {
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
