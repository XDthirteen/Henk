/*#####################################
/
/ # EditIcon.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Bewerkicoon dat verander naar save icoon
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 22/01/2025
/
#################
/
/ Changelog:
/ ----------
/ 22/01/2025 - Arno Defillet
/ - Start van de layout
/
/ 29/01/2025 - Arno Defillet
/ - Aanpassing : icoon laten veranderen on click
/ - Toevoeging : Props voorzien op de image
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

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  iconToggler: Boolean
});

</script>

<template>
  <img class="edit-image" :src="iconToggler ? '/images/save-icon.png' : '/images/edit-icon.png'"
    :alt="iconToggler ? 'save-icon' : 'edit-icon'" @click="$emit('toggle-edit')">
</template>

<style scoped>
.edit-image {
  width: 10%;
  max-width: 4em;
}
</style>
