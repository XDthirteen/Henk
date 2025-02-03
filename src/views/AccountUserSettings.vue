/*#####################################
/
/ # AccountUserSettings.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De view om uw usersettings te zien en aan te passen
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 15/01/2025
/
#################
/
/ Changelog:
/ ----------
/ 15/01/2025 - Arno Defillet
/ - Start van de view met 1 div ter testing
/
/ 22/01/2025 - Arno Defillet
/ - Toegevoegd: Uitbouw van de structuur van deze view.
/
/ 29/01/2025 - Arno Defillet
/ - Aanpassing: Aanpassen van de edit/save-icoon zodat een div in een input veranderd.
/ - Aanpassing: Reactieve inputvelden: wanneer je op de edit icon klikt, veranderd div element naar input element.
/ Na aanpassing in inputveld > klikken op bewaar icoon, zal dit getoond worden in de paarse kader erboven
/
/ To do:
/ - API integratie
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import EditIcon from '@/components/EditIcon.vue';

const savedValues = ref({
  firstname: "Arno",
  lastname: "Defillet",
  city: "Tienen",
  language: "Dutch"
});

const tempValues = ref({ ...savedValues.value });

const isEditing = ref({
  firstname: false,
  lastname: false,
  city: false,
  language: false
});

function toggleEdit(field: keyof typeof isEditing.value) {
  if (isEditing.value[field]) {
    savedValues.value[field] = tempValues.value[field];
  } else {
    tempValues.value[field] = savedValues.value[field];
  }

  isEditing.value[field] = !isEditing.value[field];
}
</script>

<template>
  <div class="user-overview">
    <img class="user-image" src="../assets/images/cool_duck.png" alt="">
    <div class="user-info">
      <div class="user-fullname">{{ savedValues.firstname }} {{ savedValues.lastname }}</div>
      <div id="userId">My userID: ...</div>
      <div id="firstname">Firstname: {{ savedValues.firstname }}</div>
      <div id="lastname">Lastname: {{ savedValues.lastname }}</div>
      <div id="city">City: {{ savedValues.city }}</div>
      <div id="language">Language: {{ savedValues.language }}</div>
    </div>
  </div>

  <div class="field-container-wrapper">
    <div class="input-title">First name: </div>
    <div class="field-container">
      <div v-if="!isEditing.firstname" class="text-field">{{ savedValues.firstname }}</div>
      <input v-else v-model="tempValues.firstname" class="edit-input" type="text" />
      <EditIcon :isEditing="isEditing.firstname" @toggle-edit="toggleEdit('firstname')" />
    </div>

    <div class="input-title">Last name: </div>
    <div class="field-container">
      <div v-if="!isEditing.lastname" class="text-field">{{ savedValues.lastname }}</div>
      <input v-else v-model="tempValues.lastname" class="edit-input" type="text" />
      <EditIcon :isEditing="isEditing.lastname" @toggle-edit="toggleEdit('lastname')" />
    </div>

    <div class="input-title">City: </div>
    <div class="field-container">
      <div v-if="!isEditing.city" class="text-field">{{ savedValues.city }}</div>
      <input v-else v-model="tempValues.city" class="edit-input" type="text" />
      <EditIcon :isEditing="isEditing.city" @toggle-edit="toggleEdit('city')" />
    </div>

    <div class="input-title">Language: </div>
    <div class="field-container">
      <div v-if="!isEditing.language" class="text-field">{{ savedValues.language }}</div>
      <input v-else v-model="tempValues.language" class="edit-input" type="text" />
      <EditIcon :isEditing="isEditing.language" @toggle-edit="toggleEdit('language')" />
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 1rem 2rem 1rem 2rem;
}

.user-overview {
  display: flex;
  border: 2px solid var(--primary-purple);
  border-radius: 10px;
  background-color: var(--tertiary-purple);
  padding: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.user-image {
  border-radius: 100%;
  width: 20%;
  margin: 2rem 2rem 2rem 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}

.user-fullname {
  text-decoration: underline;
  padding-bottom: 1rem;
}

.input-title {
  margin-bottom: 0rem;
}

.field-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.text-field {
  display: flex;
  border: 1px solid var(--secundary-purple);
  border-radius: 5px;
  width: 80%;
  align-items: center;
  padding-left: 1rem;

}
</style>
