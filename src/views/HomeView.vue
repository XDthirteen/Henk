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
/ 10/06/2025 - Arno Defillet
/ - Extra styling toegevoegd
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
  <ModuleTitleContainer>Welkom bij Henk</ModuleTitleContainer>
  <main class="home-container">
    <div class="title">
      <H1>Wie zijn we?</H1>
    </div>


    <div class="intro">
      <p>
        Het groepsproject is begonnen in December 2024 door de groep bestaande uit <a
          href="https://github.com/arnodefillet" target="_blank">Arno</a>,
        <a href="https://github.com/XDthirteen" target="_blank">Jorn</a>,
        <a href="https://github.com/Daemszzz" target="_blank">Kevin</a> &
        <a href="https://github.com/Gert-JanGe" target="_blank">Gert-Jan</a>
        – met een beetje magische support van <a href="https://github.com/anneleenscholts" target="_blank">Anneleen</a>.
      </p>
      <p>
        Na een brainstorm en een Miro-schets ontstond <strong>Henk</strong>: een slimme, intuïtieve kalender-app voor
        jouw planning.
      </p>
      <p>We hopen dat je er net zoveel plezier aan beleeft als wij aan het bouwen ervan!</p>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  animation: fadeIn 1s ease-in-out;
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.title h1 {
  font-size: 3rem;
  color: var(--purple-text);
  margin-bottom: 0.5rem;
}


.intro {
  max-width: 800px;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.8;
}

a {
  color: var(--black-text);
  text-decoration: underline;
  transition: color 0.2s ease;
}

a:hover {
  color: deeppink;
}

p {
  color: var(--purple-text);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
