/*#####################################
/
/ # RegisterView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Het kunnen aanmaken van een gebruiker.
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 16/11/2024
/
#################
/
/ Changelog:
/ ----------
/ 18/11/2024 - Arno Defillet
/ - Start van de view
/ - Opzetten van de Axios Post -> Deze retourneert in een 400 error. Nog uit te zoeken.
/
/ 08/01/2025 - Arno Defillet
/ - Toevoegen van boodschap bij succesvol creeren van gebruiker + navigeren naar Login
/ - Toevoegen van boodschap indien username of email al bestaat
/
/ 13/01/2025 - Arno Defillet
/ - De userData in een interface steken en verhuizen naar de components/models.ts
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { reactive, ref, type Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import type { UserData } from '@/components/models';
import StyledButton from '@/components/StyledButton.vue';
import StyledInputByType from '@/components/StyledInputByType.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import SuccessMessage from '@/components/popups/SuccessMessage.vue';

const router = useRouter();

const buttonType = "primary";

// const languages: Language[] = [
//   { code: 'en', label: 'English' },
//   { code: 'nl', label: 'Nederlands' }
// ];

// const selectedLanguage = ref<{ default: string }>({
//   default: 'en'
// });

// const toggleLanguage = () => {
//   selectedLanguage.value.default = selectedLanguage.value.default === 'en' ? 'nl' : 'en';
//   userData.defaultLanguage = selectedLanguage.value.default;
//   console.log('Selected language:', selectedLanguage.value.default);
// };

const userData = reactive<UserData>({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  defaultLanguage: 'en',
});

const confirmPassword = ref<string>('');

const correctRegisterPasswords: Ref<boolean | undefined> = ref();
const doubleUsernameOrEmail: Ref<boolean | undefined> = ref();

const registerUser = async (user: UserData): Promise<string> => {
  try {
    // Verstuur een POST-verzoek naar de API met de ingevoerde parameters
    const response = await axios.post<{ message: string }>("/api/auth/register", user)
    const message = response.data.message;
    return message;

  } catch (error) {
    if ((error as AxiosError).response?.status === 400) {
      console.error("Error in registerUser (API call) " + error)
      doubleUsernameOrEmail.value = true;
      throw new Error(`Error: ${error}`);
    } else {
      throw new Error(`Error: ${error}`);
    }
  }
}

const createUser = async () => {
  // Reset foutmeldingen
  correctRegisterPasswords.value = undefined;
  doubleUsernameOrEmail.value = undefined;

  if (userData.password !== confirmPassword.value) {
    correctRegisterPasswords.value = false;
  } else {
    try {
      await registerUser(userData);
      correctRegisterPasswords.value = true;
      setTimeout(() => {
        router.push({ name: 'login' });
      }, 3000);
    } catch (error) {
      console.error("Error in createUser. " + error);
    }
  }
}

// const setLanguage = (lang: string) => {
//   selectedLanguage.value.default = lang;
//   userData.defaultLanguage = lang;
//   console.log('Selected language:', lang);
// };

</script>

<template>
  <h2>Create account</h2>
  <form>
    <StyledInputByType v-model="userData.username" label="Username:" placeholder="Choose an username">
    </StyledInputByType>
    <StyledInputByType v-model="userData.email" label="Email:" placeholder="Enter email" inputType="email">
    </StyledInputByType>
    <StyledInputByType v-model="userData.password" label="Password:" placeholder="Choose a password"
      inputType="password" autocomplete="off">
    </StyledInputByType>
    <StyledInputByType v-model="confirmPassword" label="Confirm password:" placeholder="Confirm password"
      inputType="password" autocomplete="off">
    </StyledInputByType>
    <StyledInputByType v-model="userData.firstName" label="First name:" placeholder="Your first name">
    </StyledInputByType>
    <StyledInputByType v-model="userData.lastName" label="Last name:" placeholder="Your last name">
    </StyledInputByType>

    <!-- <div class="container">
      <div class="language-toggle">
        <div class="language-option" :class="{ active: selectedLanguage.default === 'en' }" @click="setLanguage('en')">
          English
        </div>
        <div class="language-option" :class="{ active: selectedLanguage.default === 'nl' }" @click="setLanguage('nl')">
          Nederlands
        </div>
      </div>
    </div> -->
  </form>
  <StyledButton :type="buttonType" @click="createUser()">Create account</StyledButton>
  <SuccessMessage class="succes-message" v-if="correctRegisterPasswords">User succesfull created</SuccessMessage>
  <ErrorMessage v-if="doubleUsernameOrEmail">Username or emailadres already registered.</ErrorMessage>
  <ErrorMessage v-if="correctRegisterPasswords === false">Passwords do not match</ErrorMessage>
</template>

<style scoped>
h2 {
  color: var(--black-text);
}

.container {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.language-toggle {
  display: flex;
  width: 100%;
  border: 2px solid var(--input-border);
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
}

.language-option {
  flex: 1;
  padding: 0.4rem;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
}

.language-option.active {
  background-color: var(--primary-button);
  color: var(--main-text);
  font-weight: bold;
}
</style>
