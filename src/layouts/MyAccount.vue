/*#####################################
/
/ # MyAccount.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Pagina die 2 buttons voorziet (userSettings & Parameters)
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
/ 15/01/2025---Arno Defillet----Start van de layout
/ Toevoeging : Volledige pagina uitwerken
/ Toevoeging : CSS toevoegen
/ 22/01/2025---Arno Defillet----Aanpassing : HTML buttons aanpassen naar StyledButtons
/ 29/01/2025---Arno Defillet----Aanpassing : onnodige types in StyledButton aanpassen :type="buttonType" =>
type="primary"
/
/ To do:
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { useRouter } from 'vue-router';
import StyledButton from '@/components/StyledButton.vue';
import ModuleTitleContainer from '@/components/ModuleTitleContainer.vue';

const router = useRouter();

</script>

<template>
  <ModuleTitleContainer>My account</ModuleTitleContainer>
  <div class="button-container">
    <StyledButton type="primary" @click="router.push({ name: 'settings' })">User Settings</StyledButton>
    <StyledButton type="primary" @click="router.push({ name: 'parameters' })">Parameters</StyledButton>
  </div>


  <RouterView />
</template>

<style scoped>
.button-container {
  margin: 0 2rem 0 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0.5rem;
}
</style>
