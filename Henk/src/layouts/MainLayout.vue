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


<style scoped>

.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-login{
    color: white;
    background-color: #453d83;
    border-radius: 5%;
    padding: 0.2rem 1rem 0.2rem 1rem;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    transition-duration: 0.4s;
    margin: 5px;
    border: 2px solid #453d83;
}
.main-login:hover{
    color: #453d83;
    background-color: white;
    border: 2px solid #453d83
}

</style>
