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
/ 02/06/2025 - Gert-Jan Germeys
/ - Change to AboutPage
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
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue';

</script>

<template>
  <main>
    <ModuleTitleContainer>Wie zijn we?</ModuleTitleContainer>
    <p>Het groepsproject is begonnen in December 2024 door de groep bestaande uit <a href="https://github.com/arnodefillet">Arno</a>, <a href="https://github.com/XDthirteen">Jorn</a>, <a href="https://github.com/Daemszzz">Kevin</a> & <a href="https://github.com/Gert-JanGe">Gert-Jan</a> met een klein beetje <a href="https://github.com/anneleenscholts">Anneleen</a> voor support.</p>
    <p>Na vershillende ideeën zijn we op Henk uitgekomen, een persoonlijke calender webapp.</p>
    <p>We hebben op Miro een voorbeeld gemaakt om dan direct in Vue aan het werk te gaan.</p>
    <p>Dit is het resultaat hier van!</p>
  </main>
</template>


<style scoped>
main {
  color: var(--purple-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

a:link{
  color: white;
  text-decoration: none;
}
a:active{
  color: white;
  text-decoration: none;
}
a:visited{
  color: white;
  text-decoration: none;
}
a:hover{
  color: deeppink;
}
</style>
