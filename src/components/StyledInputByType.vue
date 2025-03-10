/*#####################################
/
/ # StyledInputByType.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een input component die op de hele app ingeladen kan worden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 20/01/2025
/
#################
/
/ Changelog:
/ ----------
/ 20/01/2025 - Arno Defillet
/ - Start van de layout
/ - Toevoeging : Volledige pagina uitwerken
/ - Toevoeging : CSS toevoegen
/
/ 22/01/2025 - Arno Defillet
/ - Aanpassing : Huisstijl toevoegen aan de input
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
const { label, inputType = "text", placeholder, autocomplete } = defineProps<{
  label?: string,
  inputType?: string,
  placeholder?: string,
  autocomplete?: string,
}>();

const modelValue = defineModel<string>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  modelValue.value = target.value;
}
</script>

<template>
  <label v-if="label">{{ label }}</label>
  <input class="input" :type='inputType' :autocomplete="autocomplete" :placeholder="placeholder" @input="handleInput"
    :value="modelValue" />
</template>

<style scoped>
.input {
  width: 13rem;
  border: 2px solid var(--primary-blue);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.input:focus {
  background-color: var(--tertiary-purple);
}
</style>
