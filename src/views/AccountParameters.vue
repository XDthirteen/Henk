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
import FontAwesomeIcon from '@/components/FontAwasomeIcon.vue';
import { userSettings } from '@/services/userSettings.service';

const { getUserParam, userParam, updateUserParam } = userSettings();


const isEditingParam = ref<ParamEditingState>({
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
  const isEditingParamActive: boolean = Object.values(isEditingParam.value).includes(true);

  return !hasChanges || isEditingParamActive;
}

const setTheme = (theme: string) => {
  paramTempValues.value.theme = theme;
};

function toggleEdit(field: keyof typeof isEditingParam.value) {
  if (!isEditingParam.value[field]) {
    paramTempValues.value[field] = paramSavedValues.value[field];
  }
  isEditingParam.value[field] = !isEditingParam.value[field];
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
</script>

<template>
  <div class="body">
    <div class="button-wrapper">
      <StyledButton v-if="!isSaveDisabled()" type="save" @click="saveParamChanges">Save</StyledButton>
    </div>
    <div class="field-container-wrapper">
      <h2 class="input-title">Default city for 'Weather app':</h2>
      <div class="field-container">
        <div v-if="!isEditingParam.city" class="text-field">{{ paramTempValues.city }}</div>
        <StyledInputByType input-type="text" v-else v-model="paramTempValues.city"></StyledInputByType>
        <FontAwesomeIcon :isEditing="isEditingParam.city" @toggle-edit="toggleEdit('city')" />
      </div>
      <h2 class="input-title">Default app on Home:</h2>
      <div class="field-container">
        <div v-if="!isEditingParam.app" class="text-field">{{ paramTempValues.app }}</div>
        <StyledDropdown v-else v-model="paramTempValues.app" :options="[
          { value: 'weather', text: 'Weather' },
          { value: 'myTasks', text: 'My Tasks' },
          { value: 'translator', text: 'Translator' },
          { value: 'calendar', text: 'Calendar' }
        ]" />
        <FontAwesomeIcon :isEditing="isEditingParam.app" @toggle-edit="toggleEdit('app')" />
      </div>
      <h2 class="input-title">Default theme:</h2>
      <div class="field-container">
        <div v-if="!isEditingParam.theme" class="text-field">{{ paramTempValues.theme }}</div>
        <div v-else class="theme-selector">
          <button :class="{ active: paramTempValues.theme === 'Light' }" @click="setTheme('Light')">
            Light
          </button>
          <button :class="{ active: paramTempValues.theme === 'Dark' }" @click="setTheme('Dark')">
            Dark
          </button>
        </div>
        <!-- <EditIcon :isEditingParam="isEditingParam.theme" @toggle-edit="toggleEdit('theme')" /> -->
        <FontAwesomeIcon :isEditing="isEditingParam.theme" @toggle-edit="toggleEdit('theme')" />
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
