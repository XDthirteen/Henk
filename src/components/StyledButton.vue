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
/ 03/06/2025 - Jorn Vierbergen
/ - Toevoeging: HTML button type 'submit' nodig voor CalendarEventView form.
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
type ButtonType = 'default' | 'primary' | 'secundary' | 'negative' | 'save';
type HTMLButtonType = 'button' | 'submit' | 'reset';

const props = defineProps<{ 
  type?: ButtonType 
  buttonTypeHTML?: HTMLButtonType
  }>()
  
const htmlType = props.buttonTypeHTML ?? 'button';

</script>

<template>
  <button 
    :type="htmlType"
    :class="{
      'primary': type === 'primary',
      'secundary': type === 'secundary',
      'negative': type === 'negative',
      'save': type === 'save'
    }">
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
  color: var(--main-text);
  border: 2px solid var(--hover-button)
}

.secundary {
  background-color: var(--secundary-button);
  color: var(--main-text);
  border: 2px solid var(--secundary-button);
}

.secundary:hover {
  background-color: var(--hover-button);
  color: var(--main-text);
  border: 2px solid var(--hover-button)
}

.negative {
  background-color: var(--main-red);
  color: var(--main-text);
}

.negative:hover {
  background-color: var(--hover-red);
  color: var(--main-text);
}

.save {
  background-color: var(--green-button);
  color: var(--black-text);
}

.save:hover {
  background-color: var(--hover-green);
  color: var(--black-text);
}
</style>
