/*#####################################
/
/ # LoginView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De login pagina zodat een gebruiker kan aanmelden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 11/12/2024
/
#################
/
/ Changelog:
/ ----------
/ 11/12/2024 - Arno Defillet
/ - Start van de view
/ - Toegevoegd: Uitwerken van de structuur + javascript (API)
/
/ To do:
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script lang="ts" setup>
import { useAuth } from '@/services/auth.service';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { userSettings } from '@/services/userSettings.service'
import StyledInputByType from '@/components/StyledInputByType.vue';
import StyledButton from '@/components/StyledButton.vue';

const buttonType = "primary";

const router = useRouter();

const { login } = useAuth();

// Declareer een referentie voor de ingevoerde gebruikersnaam & wachtwoord
const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

// Initialiseren van referentie voor verkeerde inloggegevens en default op False zetten
const wrongCredentials: Ref<boolean> = ref(false);

// Functie om de huidige gebruiker te authenticeren
const authenticate = async () => {
  try {
    await login(inputUsername.value, inputPassword.value)
    wrongCredentials.value = false;
    //console.log('Succesfull authenticated')

    const { getUserParam, userParam } = userSettings();

    await getUserParam();

    const favoriteApp = userParam.value?.app || 'home';
    router.push({ name: favoriteApp });

  } catch (error) {
    wrongCredentials.value = true;
    console.error(error)
  }
}
</script>

<template>
  <h2>Log in</h2>
  <div class="login-container">
    <form class="form-wrapper">
      <div class="error-message" v-if="wrongCredentials">Incorrect username - password combination</div>
      <StyledInputByType input-type="email" placeholder="example@example.com" v-model="inputUsername"
        autocomplete="email"></StyledInputByType>
      <StyledInputByType input-type="password" placeholder="Your password" v-model="inputPassword"
        autocomplete="current-password" @keyup.enter="authenticate()"></StyledInputByType>
    </form>

    <div class="button-container">
      <StyledButton :type="buttonType" @click="authenticate()">Login</StyledButton>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: var(--black-text);
}

.login-container {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  max-width: 12rem;
  align-items: center;
  gap: 0.5rem;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message {
  border: 3px solid black;
  padding: 0.5rem;
  background-color: var(--main-red);
  border-radius: 10px;
}
</style>
