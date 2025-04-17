/*#####################################
/
/ # PopUpComponent.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een component voor een popup / modal
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 17/04/2025
/
#################
/
/ Changelog:
/ ----------
/ 13/03/2025---Arno Defillet----Start van de view
/
/ To do:
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/


<script setup lang="ts">
const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click="emitClose">
    <div class="popup-content" @click.stop>
      <button class="close-btn" @click="emitClose">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: var(--primary-white);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.7);
  max-width: 400px;
  position: relative;
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-purple);
  cursor: pointer;
}
</style>
