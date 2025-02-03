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
/ ----------
/ 15/01/2025 - Arno Defillet
/ - Start van de layout
/ - Toevoeging : Volledige pagina uitwerken
/ - Toevoeging : CSS toevoegen
/
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <div>
    MainLayout.vue
    <button @click="router.push({ name: 'myAccount' })">Go to My account</button>
    <RouterView />
  </div>
</template>


<style scoped></style>
