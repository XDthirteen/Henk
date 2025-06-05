/*#####################################
/
/ # MainLayout.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De basis pagina waar alles op ingeladen zal worden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 15/01/2025
/
#################
/
/ Changelog:
/ Date:--------User:------------Changes:
/ -------------------------------------------------------------------
/ 15/01/2025---Arno Defillet----Start van de layout
/ 15/01/2025---Arno Defillet----Toevoeging : Volledige pagina uitwerken
/ 15/01/2025---Arno Defillet----Toevoeging : CSS toevoegen
/ 25/01/2025---Arno Defillet----Toevoeging : Verplaatsen van de hamburgermenu naar de hoofdlayout
/ 25/01/2025---Arno Defillet----Aanpassing : Styling aanpassen van de menu
/ 10/02/2025---Arno Defillet----Aanpassing : Toevoegen van FontAwesomeIcons
/ 12/02/2025---Arno Defillet----Aanpassing : Verwijderen van redirect to 'login' uit logout en in de service gestoken
/ 03/04/2025---Arno Defillet----Aanpassing : hamburgermenu Tasks navigeren van navigate('tasks') naar
navigate('todo_tasks')
/ 17/04/2025---Arno Defillet----Verwijder : Alles van hamburgermenu verplaatst naar nieuwe component HamburgerMenu.vue
/
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import Hamburgermenu from '@/components/HamburgerMenu.vue';
/*TIJDELIJK*/
// import { ref, onMounted } from 'vue';

// const themes = ['light', 'dark', 'deeppink'];
// const currentTheme = ref('light');

// const applyTheme = () => {
//   document.body.classList.remove('light-theme', 'dark-theme', 'deeppink-theme');
//   document.body.classList.add(`${currentTheme.value}-theme`);
// };

// const toggleTheme = () => {
//   const currentIndex = themes.indexOf(currentTheme.value);
//   const nextIndex = (currentIndex + 1) % themes.length;
//   currentTheme.value = themes[nextIndex];
//   applyTheme();
// };

// onMounted(() => {
//   applyTheme();
// });
/*TIJDELIJK*/
</script>

<template>
  <div class="body">
    <button @click="toggleTheme">theme</button>
    <Hamburgermenu />
    <RouterView />
  </div>
</template>


<style scoped>
.body {
  /* margin: 8px; */
  padding-top: 3rem;
}
</style>
