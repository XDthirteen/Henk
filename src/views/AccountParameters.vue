/*#####################################
/
/ # AccountParameters.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De view om uw parameters te zien en aan te passen
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
/ 26/02/2025---Arno Defillet----Volledige uitwerking van pagina (gebaseerd op AccountUserSettings)
/ 19/04/2025---Arno Defillet----Aanpassing: zorgen dat de benaming van Default app weergegeven wordt als mooie tekst, en
dat er een waarde wordt weggeschreven die in de router gebruikt wordt
/
/ To do:
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#############
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import StyledInputByType from '@/components/StyledInputByType.vue';
import StyledDropdown from '@/components/StyledDropdown.vue';
import StyledButton from '@/components/StyledButton.vue';
import type { ParamSavedValues, ParamEditingState } from '@/components/models';
import FontAwesomeIconToggler from '@/components/FontAwasomeIconToggler.vue';
import { userSettings, applyTheme } from '@/services/userSettings.service';

const { getUserParam, userParam, updateUserParam } = userSettings();


const iconTogglerParam = ref<ParamEditingState>({
  city: false,
  app: false,
  theme: false
});

const paramSavedValues = ref<ParamSavedValues>({
  city: '',
  app: '',
  theme: ''
});

const paramTempValues = ref<ParamSavedValues>({ ...paramSavedValues.value });

onMounted(async () => {
  await getUserParam();

  if (userParam.value) {
    paramSavedValues.value = {
      city: userParam.value.city,
      app: userParam.value.app,
      theme: userParam.value.theme
    };
    paramTempValues.value = { ...paramSavedValues.value };
  }
})

function isSaveDisabled(): boolean {
  // Controleer of er een verschil is tussen paramparamTempValues en savedValues
  let hasChanges = false;
  for (const key in paramSavedValues.value) {
    if (
      paramSavedValues.value[key as keyof ParamSavedValues] !==
      paramTempValues.value[key as keyof ParamSavedValues]
    ) {
      hasChanges = true;
      break;
    }
  }

  // Controleer of er nog velden in bewerkmodus staan
  const iconTogglerParamActive: boolean = Object.values(iconTogglerParam.value).includes(true);

  return !hasChanges || iconTogglerParamActive;
}


function toggleEdit(field: keyof typeof iconTogglerParam.value) {
  if (!iconTogglerParam.value[field]) {
    paramTempValues.value[field] = paramSavedValues.value[field];
  }
  iconTogglerParam.value[field] = !iconTogglerParam.value[field];
}

const saveParamChangesToBackend = async (): Promise<void> => {
  const updatedData = await updateUserParam(paramTempValues.value);
  if (updatedData) {
    console.log("Update succesvol!", updatedData);
  }
};

function saveParamChanges(): void {
  paramSavedValues.value = { ...paramTempValues.value };
  saveParamChangesToBackend();
}

const setTheme = (theme: string) => {
  paramTempValues.value.theme = theme;
  applyTheme(theme);
};
</script>

<template>
  <div class="body">
    <div class="button-wrapper">
      <StyledButton v-if="!isSaveDisabled()" type="save" @click="saveParamChanges">Save</StyledButton>
    </div>
    <div class="field-container-wrapper">
      <h2 class="input-title">Default city for 'Weather app':</h2>
      <div class="field-container">
        <div v-if="!iconTogglerParam.city" class="text-field">{{ paramTempValues.city }}</div>
        <StyledInputByType input-type="text" v-else v-model="paramTempValues.city"></StyledInputByType>
        <FontAwesomeIconToggler :iconToggler="iconTogglerParam.city" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('city')" />
      </div>
      <h2 class="input-title">Default app on Home:</h2>
      <div class="field-container">
        <div v-if="!iconTogglerParam.app" class="text-field">
          {{
            {
              home: 'home',
              weather: 'Weather',
              todo_tasks: 'My Tasks',
              translator: 'Translator',
              calendar: 'Calendar'
            }[paramTempValues.app] || paramTempValues.app
          }}
        </div>
        <StyledDropdown v-else v-model="paramTempValues.app" :options="[
          { value: 'home', text: 'Home' },
          { value: 'weather', text: 'Weather' },
          { value: 'todo_tasks', text: 'My Tasks' },
          { value: 'translator', text: 'Translator' },
          { value: 'calendar', text: 'Calendar' }
        ]" />
        <FontAwesomeIconToggler :iconToggler="iconTogglerParam.app" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('app')" />
      </div>
      <h2 class="input-title">Default theme:</h2>
      <div class="field-container">
        <div v-if="!iconTogglerParam.theme" class="text-field">{{ paramTempValues.theme }}</div>
        <div v-else class="theme-selector">
          <button :class="{ active: paramTempValues.theme === 'Light' }" @click="setTheme('Light')">
            Light
          </button>
          <button :class="{ active: paramTempValues.theme === 'Dark' }" @click="setTheme('Dark')">
            Dark
          </button>
        </div>
        <!-- <EditIcon :iconTogglerParam="iconTogglerParam.theme" @toggle-edit="toggleEdit('theme')" /> -->
        <FontAwesomeIconToggler :iconToggler="iconTogglerParam.theme" icon1="floppy-disk" icon2="pen-to-square"
          @toggle="toggleEdit('theme')" />
        <!--Nog aan te passen zoals EditIcon-->
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  margin: 1rem 2rem 1rem 2rem;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
}

.field-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.input-title {
  margin-bottom: 0rem;
  font-weight: bolder;
  text-decoration: underline;
  margin-left: 0.5rem;
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

.theme-selector {
  width: 13rem;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.theme-selector button {
  flex: 1;
  padding: 10px;
  border: none;
  background: var(--primary-white);
  transition: background 0.3s;
}

.theme-selector button.active {
  background: var(--secundary-purple);
  color: white;
  font-weight: bold;
}

.theme-selector button:not(.active):hover {
  background: var(--primary-white);
}
</style>
