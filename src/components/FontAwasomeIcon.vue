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

defineProps<{ isEditing: boolean }>();
const emit = defineEmits(['toggle-edit']);

</script>

<template>
  <font-awesome-icon class="icon" :icon="['fas', isEditing ? 'floppy-disk' : 'pen-to-square']"
    @click="emit('toggle-edit')" /></template>

<style scoped>
.icon {
  width: 40px;
  height: 40px;
  margin-bottom: 3px;
}
</style>
