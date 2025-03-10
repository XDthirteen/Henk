/*#####################################
/
/ # StyledButton.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een input component met keuzeopties die op de hele app ingeladen kan worden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 26/02/2025
/
#################
/
/ Changelog:
/ ----------
/ Date:--------User:------------Omschrijving:
/ -------------------------------------------------------------------
/ 26/02/2025---Arno Defillet----Start van de layout
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
const { label, options } = defineProps<{
  label?: string;
  options: { value: string; text: string }[];
}>();

const modelValue = defineModel<string>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  modelValue.value = target.value;
};
</script>

<template>
  <label v-if="label">{{ label }}</label>
  <select class="dropdown" @change="handleChange" :value="modelValue">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped>
.dropdown {
  width: 13rem;
  padding: 0.5rem;
  border: 2px solid var(--primary-blue);
  border-radius: 0.5rem;
}

.dropdown:focus {
  background-color: var(--tertiary-purple);
}
</style>
