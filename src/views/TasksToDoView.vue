/*#####################################
/
/ # TaskToDoView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een view om uw openstaande taken te controleren
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 13/03/2025
/
#################
/
/ Changelog:
/ ----------
/ 13/03/2025---Arno Defillet----Start van de view + toevoegen van icon toggler
/ 17/03/2025---Arno Defillet----Aanpassing van icoon variabelen
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
import { ref } from "vue";
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";

const completed = ref(false);
const iconDone = 'check-circle';
const iconNotDone = 'circle-notch';

const toggleCompleted = () => {
  completed.value = !completed.value;
  console.log(completed.value)
};
</script>

<template>
  <div>
    <transition name="scale" mode="out-in">
      <FontAwesomeIconToggler :key="completed ? 'iconNotDone' : 'iconDone'" :iconToggler="completed" :icon1="iconDone"
        :icon2="iconNotDone" @toggle="toggleCompleted" />
    </transition>
  </div>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease-in-out;
}

.scale-enter,
.scale-leave-to {
  transform: scale(0.5);
}
</style>
