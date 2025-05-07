/*#####################################
/
/ # GroupNavigation.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een icoon om naar de groepen te kunnen navigeren in de calendar app.
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 07/05/2025
/
#################
/
/ Changelog:
/ ----------
/ 07/05/2025---Arno Defillet----Start van de component
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
import router from '@/router';

const toggleGroups = () => {
  router.push({ name: 'groups' })
};
</script>

<template>
  <div class="button-container">
    <div class="small-icon">
      <font-awesome-icon class="icon" :icon="['fas', 'user-group']" @click="toggleGroups" />
    </div>
  </div>
</template>

<style scoped>
.button-container {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 30;
}

.small-icon {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  background: var(--primary-purple);
  color: var(--primary-white);
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icons {
  width: 40px;
  height: 40px;
  margin-bottom: 3px;
}
</style>
