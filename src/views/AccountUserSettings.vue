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
/ 19/02/2025---Arno Defillet----Toevoeging: API integratie voor het ophalen van de user informatie
/ 19/02/2025---Arno Defillet----Toevoeging: API integratie voor het updaten van de user informatie
/ 24/02/2025---Arno Defillet----Aanpassing: Eigenschappen in Savedvalues aanpassen naar blanco strings, en strings met
'Loading...' naar onMounted verplaatst
/ 24/02/2025---Arno Defillet----Toevoegen: Overal Typescript toepassen
/ 10/03/2025---Arno Defillet----Aanpassing: "EditIcon"'s aangepast naar "FontAwasomeIcon"'s
/
/
/ To do:
/ - Bewerk en save icons nog aan te passen ipv images
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import StyledButton from '@/components/StyledButton.vue';
import StyledInputByType from '@/components/StyledInputByType.vue';
import { userSettings } from '@/services/userSettings.service';
import FontAwesomeIconToggler from '@/components/FontAwasomeIconToggler.vue';
import type { EditingState, SavedValues } from '@/components/models';

const { userInfo, updateUserInfo, getUserInfo } = userSettings();

const iconToggler = ref<EditingState>({
  firstname: false,
  lastname: false,
  email: false,
  language: false
});

const savedValues = ref<SavedValues>({
  id: 0,
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  language: ''
});

const tempValues = ref<SavedValues>({ ...savedValues.value });

onMounted(async () => {
  savedValues.value.id = 0;
  savedValues.value.username = 'Loading...';
  savedValues.value.firstname = 'Loading...';
  savedValues.value.lastname = 'Loading...';
  savedValues.value.email = 'Loading...';
  savedValues.value.language = 'Loading...';

  await getUserInfo();

  if (userInfo.value) {
    savedValues.value = {
      id: userInfo.value.id,
      username: userInfo.value.username,
      firstname: userInfo.value.firstName,
      lastname: userInfo.value.lastName,
      email: userInfo.value.email,
      language: userInfo.value.defaultLanguage,
    };
    tempValues.value = { ...savedValues.value };
  }
})

const saveChangesToBackend = async (): Promise<void> => {
  const updatedData = await updateUserInfo(tempValues.value);
  if (updatedData) {
    console.log("Update succesvol!", updatedData);
  }
};

// const setLanguage = (lang: string) => {
//   tempValues.value.language = lang;
// };

function toggleEdit(field: keyof typeof iconToggler.value) {
  if (!iconToggler.value[field]) {
    tempValues.value[field] = savedValues.value[field];
  }
  iconToggler.value[field] = !iconToggler.value[field];
}

function isSaveDisabled(): boolean {
  // Controleer of er een verschil is tussen tempValues en savedValues
  let hasChanges = false;
  for (const key in savedValues.value) {
    if (savedValues.value[key as keyof SavedValues] !== tempValues.value[key as keyof SavedValues]) {
      hasChanges = true;
      break;
    }
  }

  // Controleer of er nog velden in bewerkmodus staan
  const iconTogglerActive: boolean = Object.values(iconToggler.value).includes(true);

  return !hasChanges || iconTogglerActive;
}

function saveUserChanges(): void {
  savedValues.value = { ...tempValues.value };
  saveChangesToBackend();
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
            <h2 class="user-fullname">{{ savedValues.username }}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>UserID</p>
            <p>Firstname</p>
            <p>Lastname</p>
            <p>Email</p>
            <!-- <p>Language</p> -->
          </div>
          <div class="col">
            <p id="userId">{{ savedValues.id }}</p>
            <p id="firstname">{{ savedValues.firstname }}</p>
            <p id="lastname">{{ savedValues.lastname }}</p>
            <p id="email">{{ savedValues.email }}</p>
            <!-- <p id="language">{{ savedValues.language }}</p> -->
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
        <div v-if="!iconToggler.firstname" class="text-field">{{ tempValues.firstname }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.firstname"></StyledInputByType>
        <FontAwesomeIconToggler :iconToggler="iconToggler.firstname" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('firstname')" />
      </div>
      <h2 class="input-title">Last name: </h2>
      <div class="field-container">
        <div v-if="!iconToggler.lastname" class="text-field">{{ tempValues.lastname }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.lastname"></StyledInputByType>
        <FontAwesomeIconToggler :iconToggler="iconToggler.lastname" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('lastname')" />
      </div>
      <h2 class="input-title">Email: </h2>
      <div class="field-container">
        <div v-if="!iconToggler.email" class="text-field">{{ tempValues.email }}</div>
        <StyledInputByType input-type="text" v-else v-model="tempValues.email"></StyledInputByType>
        <FontAwesomeIconToggler :iconToggler="iconToggler.email" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('email')" />
      </div>
      <!-- <h2 class="input-title">Language: </h2>
      <div class="field-container">
        <div v-if="!iconToggler.language" class="text-field">{{ tempValues.language }}</div>
        <div v-else class="language-selector">
          <button :class="{ active: tempValues.language === 'Nederlands' }" @click="setLanguage('Nederlands')">
            Nederlands
          </button>
          <button :class="{ active: tempValues.language === 'Engels' }" @click="setLanguage('Engels')">
            English
          </button>
        </div>
        <FontAwesomeIconToggler :iconToggler="iconToggler.language" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('language')" />
      </div> -->
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
  box-shadow: 5px 5px 20px var(--title-border);
  ;
  border-radius: 10px;
  background-color: var(--second-background);
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.row {
  color: var(--purple-text);
  font-size: large;
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
  color: var(--purple-text);
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
  color: var(--purple-text);
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
}

.field-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 2px solid var(--title-border);
}

.text-field {
  font-size: large;
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
  width: 13rem;
  display: flex;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  overflow: hidden;
}

.language-selector button {
  flex: 1;
  padding: 10px;
  border: none;
  background: var(--second-background);
  transition: background 0.3s;
}

.language-selector button.active {
  background: var(--primary-button);
  color: var(--main-text);
  font-weight: bold;
}

.language-selector button:not(.active):hover {
  background: var(--main-text);
}
</style>
