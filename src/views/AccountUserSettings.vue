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
/ Date:--------User:------------Omschrijving:
/ -------------------------------------------------------------------
/ 15/01/2025---Arno Defillet----Start van de view met 1 div ter testing
/ 22/01/2025---Arno Defillet----Toegevoegd: Uitbouw van de structuur van deze view.
/ 29/01/2025---Arno Defillet----Aanpassing: Aanpassen van de edit/save-icoon zodat een div in een input veranderd.
/ 29/01/2025---Arno Defillet----Aanpassing: Reactieve inputvelden: wanneer je op de edit icon klikt,
veranderd div element naar input element.
Na aanpassing in inputveld > klikken op bewaar icoon, zal dit getoond worden in de paarse kader erboven
/ 12/02/2025---Arno Defillet----Aanpassing: user-overview volledig veranderd + onderste velden lichtjes aangepast qua
styling
/ 12/02/2025---Arno Defillet----Aanpassing: Saved velden aangepast naar TempSaved, indien iets aangepast, komt er een
save knop.
/ 17/02/2025---Arno Defillet----Aanpassing: Language inputveld aanpassen naar knoppen.
/
/ To do:
/ - API integratie
/ - Bewerk en save icons nog aan te passen ipv images
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import EditIcon from '@/components/EditIcon.vue';
import StyledButton from '@/components/StyledButton.vue';
import StyledInputByType from '@/components/StyledInputByType.vue';


const setLanguage = (lang: string) => {
  tempValues.value.language = lang;
};

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
  if (!isEditing.value[field]) {
  } else {
    tempValues.value[field] = tempValues.value[field] || savedValues.value[field];
  }
  isEditing.value[field] = !isEditing.value[field];
}

function isSaveDisabled() {
  // Controleer of er een verschil is tussen tempValues en savedValues
  let hasChanges = false;
  for (const key in savedValues.value) {
    if (savedValues.value[key] !== tempValues.value[key]) {
      hasChanges = true;
      break;
    }
  }

  // Controleer of er nog velden in bewerkmodus staan
  const isEditingActive = Object.values(isEditing.value).includes(true);

  return !hasChanges || isEditingActive;
}

function saveUserChanges() {
  savedValues.value = { ...tempValues.value };
}
</script>

<template>
  <div class="body">
    <div class="user-overview">
      <div class="container">
        <div class="row">
          <div class="col">
            <img src="../assets/images/cool_duck.png" class="user-image" alt="User_image">
          </div>
          <div class="col">
            <h2 class="user-fullname">{{ savedValues.firstname }} {{ savedValues.lastname }}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>UserID</p>
            <p>Firstname</p>
            <p>Lastname</p>
            <p>City</p>
            <p>Language</p>
          </div>
          <div class="col">
            <p id="userId">12345</p>
            <p id="firstname">{{ savedValues.firstname }}</p>
            <p id="lastname">{{ savedValues.lastname }}</p>
            <p id="city">{{ savedValues.city }}</p>
            <p id="language">{{ savedValues.language }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="button-wrapper">
      <StyledButton v-if="!isSaveDisabled()" type="save" @click="saveUserChanges">Save</StyledButton>
    </div>
    <div class="field-container-wrapper">
      <h2 class="input-title">First name: </h2>
      <div class="field-container">
        <div v-if="!isEditing.firstname" class="text-field">{{ tempValues.firstname }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.firstname"></StyledInputByType>
        <EditIcon :isEditing="isEditing.firstname" @toggle-edit="toggleEdit('firstname')" />
      </div>
      <h2 class="input-title">Last name: </h2>
      <div class="field-container">
        <div v-if="!isEditing.lastname" class="text-field">{{ tempValues.lastname }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.lastname"></StyledInputByType>
        <EditIcon :isEditing="isEditing.lastname" @toggle-edit="toggleEdit('lastname')" />
      </div>
      <h2 class="input-title">City: </h2>
      <div class="field-container">
        <div v-if="!isEditing.city" class="text-field">{{ tempValues.city }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.city"></StyledInputByType>
        <EditIcon :isEditing="isEditing.city" @toggle-edit="toggleEdit('city')" />
      </div>
      <h2 class="input-title">Language: </h2>
      <div class="field-container">
        <div v-if="!isEditing.language" class="text-field">{{ tempValues.language }}</div>
        <div v-else class="language-selector">
          <button :class="{ active: tempValues.language === 'Nederlands' }" @click="setLanguage('Nederlands')">
            Nederlands
          </button>
          <button :class="{ active: tempValues.language === 'Engels' }" @click="setLanguage('Engels')">
            English
          </button>
        </div>
        <EditIcon :isEditing="isEditing.language" @toggle-edit="toggleEdit('language')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  margin: 1rem 2rem 1rem 2rem;
}

.user-overview {
  display: flex;
  border: none;
  box-shadow: 5px 5px 30px var(--primary-purple);
  ;
  border-radius: 10px;
  background-color: var(--tertiary-purple);
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.row {
  display: flex;
}

/* .row:last-child {
  border-top: 1px solid black;
} */

.col {
  padding: 10px;
}

.col:first-child {
  width: 7rem;
  /* border-right: 1px solid black; */
}

.user-image {
  border-radius: 100%;
  width: 50%;
}

.user-fullname {
  text-decoration: underline;
  font-weight: 700;
}

.input-title {
  margin-bottom: 0rem;
  font-weight: bolder;
  text-decoration: underline;
  margin-left: 0.5rem;
}

.field-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.field-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 2px solid var(--primary-purple);
}

.text-field {
  display: flex;
  width: 80%;
  align-items: center;
  padding-left: 1rem;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
}

.language-selector {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.language-selector button {
  flex: 1;
  padding: 10px;
  border: none;
  background: var(--primary-white);
  transition: background 0.3s;
}

.language-selector button.active {
  background: var(--secundary-purple);
  color: white;
  font-weight: bold;
}

.language-selector button:not(.active):hover {
  background: var(--primary-white);
}
</style>
