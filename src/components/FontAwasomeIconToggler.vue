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
import { defineProps, defineEmits } from 'vue';

defineProps<{
  iconToggler: boolean,
  iconDone: string,
  iconNotDone: string
}>();
const emit = defineEmits(['toggle']);
</script>

<template>
  <font-awesome-icon class="icon" :icon="['fas', iconToggler ? iconDone : iconNotDone]" @click="emit('toggle')" />
</template>

<style scoped>
.icon {
  width: 40px;
  height: 40px;
  margin-bottom: 3px;
}
</style>
