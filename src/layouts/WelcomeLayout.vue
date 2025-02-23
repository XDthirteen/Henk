/*#####################################
/
/ # WelcomeLayout.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De pagina waar je login of signup knop ziet, samen met het logo. De basis pagina als je naar de website surft.
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 15/01/2025
/
#################
/
/ Changelog:
/ ----------
/ 15/01/2025 - Arno Defillet
/ - Start van de layout
/ - Toevoeging : Volledige pagina uitwerken
/ - Toevoeging : CSS toevoegen
/
/ 22/01/2025 - Arno Defillet
/ - Aanpassing : HTML buttons aanpassen naar StyledButtons
/ - Verwijdering : CSS van de buttons verwijderd
/
/ 29/01/2025 - Arno Defillet
/ - Aanpassing : onnodige types in StyledButton aanpassen :type="buttonType" => type="primary"
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
import StyledButton from '@/components/StyledButton.vue';
import CalenderEventView from '@/views/CalenderEventView.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let isVisible = true

const toggleModal = () => {
  isVisible = !isVisible
}

</script>

<template>
  <div class="wrapper">
    <div><img src="/images/logohenkFinal.png" alt="Henk" width="200"></div>
    <div>
      <StyledButton type="primary" @click="router.push({ name: 'login' })">
        Login
      </StyledButton>
      <StyledButton type="primary" @click="router.push({ name: 'signup' })">
        Sign up
      </StyledButton>
      <StyledButton type="primary" @click="alert('hello')">
        just testing shit
      </StyledButton>
    </div>
    <RouterView />
    <CalenderEventView :is-visible=isVisible default-location="genk"></CalenderEventView>
  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
