/*#####################################
/
/ # FontAwesomeIcon.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een component om een font-awesome-icon in te laden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 27/022025
/
#################
/
/ Changelog:
/ ----------
/ 15/01/2025---Arno Defillet----Start van de component
/ 13/03/2025---Arno Defillet----Aanpassing: harcoded iconen in template aangepast naar variabelen in 'defineProps'
/ 03/04/2025---Arno Defillet----Aanpassing: optionele parameter active toegevoegd ifv taken.completed
/
/ To do:
/ -
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/


<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue';

const props = defineProps<{ icon1: string, icon2: string, active?: boolean }>();
const emit = defineEmits(['toggle']);

const iconToggler = ref(props.active)

watch(() => props.active, (newValue) => {
  iconToggler.value = newValue;
});

const toggleIcon = () => {
  iconToggler.value = !iconToggler.value;
  emit('toggle');
}
</script>

<template>
  <transition name="scale" mode="out-in">
    <font-awesome-icon class="icon" :key="iconToggler ? 'icon1' : 'icon2'" :icon="['fas', iconToggler ? icon1 : icon2]"
      @click="toggleIcon" />
  </transition>
</template>

<style scoped>
.icon {
  width: 30px;
  height: 30px;
  margin-bottom: 3px;
  cursor: pointer;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease-in-out;
}

.scale-enter,
.scale-leave-to {
  transform: scale(0.5);
}
</style>
