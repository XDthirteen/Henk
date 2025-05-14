/*#####################################
/
/ # StyledButton.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een button component die op de hele app ingeladen kan worden
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
/ - Aanpassing : Huisstijl toevoegen aan de button
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
type ButtonType = "default" | "primary" | "negative" | "save";
defineProps<{ type?: ButtonType }>()
</script>

<template>
  <button :class="{ 'primary': type === 'primary', 'negative': type === 'negative', 'save': type === 'save' }">
    <slot />
  </button>
</template>

<style scoped>
button {
  border-radius: 10px;
  padding: 0.2rem 1rem 0.2rem 1rem;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  margin: 5px;
  background-color: var(--secundary-white);
  border-radius: 0.25rem;
  font-weight: 500;
  border: none;
  color: var(--primary-purple);
}

button:hover {
  background-color: var(--secundary-orange);
  color: var(--primary-purple);
  cursor: pointer;
}


.primary {
  background-color: var(--primary-button);
  color: var(--main-text);
  border: 2px solid var(--primary-button);
}

.primary:hover {
  background-color: var(--hover-button);
  color: var(--primary-button);
  border: 2px solid var(--primary-button)
}

.negative {
  background-color: #c10015;
  color: var(--main-text);
}

.negative:hover {
  background-color: #9b0012;
  color: var(--main-text);
}

.save {
  background-color: var(--primary-green);
  color: var(--black-text);
}

.save:hover {
  background-color: var(--secundary-green);
  color: var(--black-text);
}
</style>
