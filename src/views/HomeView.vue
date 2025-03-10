/*#####################################
/
/ # HomeView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De startpagina na het aanmelden
/
/ # Auteur: Kevin Daems
/ # Datum aangemaakt: 02/12/2024
/
#################
/
/ Changelog:
/ ----------
/ 02/12/2024 - Kevin Daems
/ - Start van de view
/
/ 18/12/2024 - Arno Defillet
/ - Toevoeging : Logout-functionaliteit
/ - Aanpassing : Opruimen van onnodige script imports
/
/ 13/01/2025 - Gert-Jan Germeys
/ - Toevoeging : Start CSS
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
</script>

<template>
  <main>
    <div class="home-header">This is the HomeView.vue</div>
  </main>
</template>


<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  color: white;
  background-color: blue;
  border-radius: 5%;
  padding: 0.2rem 1rem 0.2rem 1rem;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  margin: 5px;
  border: 2px solid blue
}

button:hover {
  color: blue;
  background-color: white;
  border: 2px solid blue;
}
</style>
