<script lang="ts" setup>
import { useAuth } from '@/services/auth.service';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
// import StyledInputByType from '@/components/StyledInputByType.vue';
import StyledButton from '@/components/StyledButton.vue';

const buttonType = "primary";

const router = useRouter();

const { login } = useAuth();

// Declareer een referentie voor de ingevoerde gebruikersnaam & wachtwoord
const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

// Initialiseren van referentie voor verkeerde inloggegevens en default op False zetten
const wrongCredentials: Ref<boolean | undefined> = ref();

// Functie om de huidige gebruiker te authenticeren
const authenticate = async () => {
  try {
    await login(inputUsername.value, inputPassword.value)
    wrongCredentials.value = false;
    console.log('Succesfull authenticated')

    // Doorsturen naar een andere pagina
    router.push({ name: 'home' })
  } catch (error) {
    wrongCredentials.value = true;
    console.error(error)
  }
}
</script>

<template>
  <div class="login-container">
    <form class="form-wrapper">
      <input class="login-input" id="login-username" input-type="email" placeholder="example@example.com"
        v-model="inputUsername" autocomplete="email">

      <input class="login-input" id="login-password" input-type="password" placeholder="Your password"
        v-model="inputPassword" autocomplete="current-password">
    </form>
    <div class="button-container">
      <StyledButton :type="buttonType" @click="authenticate()">Login</StyledButton>
    </div>
    <div v-if="wrongCredentials">Incorrect username - password combination</div>
  </div>
</template>

<style scoped>
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
  gap: rem;
}

.login-input {
  border: 2px solid gray;
  margin: 1px;
  padding: 5px 10px;
}

/* .button-container {
  display: flex;
} */

/* #login-btn {
  color: white;
  background-color: blue;
  border-radius: 5%;
  padding: 0.2rem 1rem 0.2rem 1rem;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  margin: 5px;
  border: 2px solid blue;
} */

#login-btn:hover {
  color: blue;
  background-color: white;
  border: 2px solid blue
}

/* #signin-btn {
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

#signin-btn:hover {
  color: blue;
  background-color: white;
  border: 2px solid blue;
} */
</style>
