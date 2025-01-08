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
/ - Opzetten van de Axios Post -> Deze retourneert in een 400 error. Nog uit te zoeken.
/ 08/01/2025 - Arno Defillet
/ - Toevoegen van boodschap bij succesvol creeren van gebruiker + navigeren naar Login
/ - Toevoegen van boodschap indien username of email al bestaat
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, type Ref } from 'vue';
import axios, { AxiosError } from 'axios';

const router = useRouter();

const languages: string[] = [
    'Nederlands',
    'English'
]

const username: Ref<string> = ref("");
const userEmail: Ref<string> = ref("");
const userPassword: Ref<string> = ref("");
const confirmPassword: Ref<string> = ref("");
const userFirstName: Ref<string> = ref("");
const userLastName: Ref<string> = ref("");
const selectedLanguage: Ref<number> = ref(0);

let correctRegisterPasswords: Ref<boolean | undefined> = ref();
let doubleUsernameOrEmail: Ref<boolean | undefined> = ref();

const registerUser = async (username: string, email: string, password: string, firstName: string, lastName: string, favoriteLanguage?: number): Promise<string> => {
    try {
        // Verstuur een POST-verzoek naar de API met de ingevoerde parameters
        const response = await axios.post<{ message: string }>("/api/auth/register", {
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            favoriteLanguage: favoriteLanguage
        });
        const message = response.data.message;
        return message;

    } catch (error) {
            if ((error as AxiosError).response?.status === 400) {
                console.log("Error in registerUser (API call) " + error)
                doubleUsernameOrEmail.value = true;
                throw new Error(`Error: ${error}`);
            } else {
                throw new Error(`Error: ${error}`);
            }
    }
}



const createUser = async () => {
    if (userPassword.value !== confirmPassword.value) {
        correctRegisterPasswords.value = false;
        const createUserMessage = "Passwords do not match."
        alert(createUserMessage);

    } else {
        try {
            await registerUser(username.value, userEmail.value, userPassword.value, userFirstName.value, userLastName.value, selectedLanguage.value);
            correctRegisterPasswords.value = true;
            setTimeout(() => {
                router.push({ name: 'login' });
            }, 3000);
        } catch (error) {
            console.log("Error in createUser. " + error)
        }
    }

}

</script>

<template>
    <h2>Create account</h2>
    <form>
        <label for="username">Username: </label><br>
        <input type="text" v-model="username" name="username" placeholder="Choose an username"><br>

        <label for="email">Email: </label><br>
        <input type="email" v-model="userEmail" name="email" autocomplete="off" placeholder="example@example.com"><br>

        <label for="pwd">Password: </label><br>
        <input type="password" v-model="userPassword" name="pwd" autocomplete="off" placeholder="***"><br>

        <label for="confirm_pwd">Confirm password: </label><br>
        <input type="password" v-model="confirmPassword" name="confirm_pwd" autocomplete="off" placeholder="***"><br>

        <label for="fname">First name: </label><br>
        <input type="text" v-model="userFirstName" name="fname"><br>

        <label for="lname">Last name: </label><br>
        <input type="text" v-model="userLastName" name="lname"><br>

        <label v-for="(language, index) in languages" :key="index">
            <input type="radio" :value="index + 1" v-model="selectedLanguage" /> {{ language }}
        </label>
    </form>
    <button @click="createUser()">Create account</button>
    <div v-if="correctRegisterPasswords">User succesfull created</div>
    <div v-if="doubleUsernameOrEmail">Username or emailadres already registered.</div>
</template>