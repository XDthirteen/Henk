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

const router = useRouter();

const languages = [
    { code: 'nl', label: 'Nederlands' },
    { code: 'en', label: 'English' },
];

const userData = reactive<UserData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    defaultLanguage: 'nl', // standaard waarde voor radio buttons
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
            console.log("Error in registerUser (API call) " + error)
            doubleUsernameOrEmail.value = true;
            throw new Error(`Error: ${error}`);
        } else {
            throw new Error(`Error: ${error}`);
        }
    }
}



const createUser = async () => {
    if (userData.password !== confirmPassword.value) {
        correctRegisterPasswords.value = false;
        alert("Passwords do not match.");
    } else {
        try {
            await registerUser(userData);
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
        <input type="text" v-model="userData.username" name="username" placeholder="Choose an username"><br>

        <label for="email">Email: </label><br>
        <input type="email" v-model="userData.email" name="email" autocomplete="off"
            placeholder="example@example.com"><br>

        <label for="pwd">Password: </label><br>
        <input type="password" v-model="userData.password" name="pwd" autocomplete="off" placeholder=""><br>

        <label for="confirm_pwd">Confirm password: </label><br>
        <input type="password" v-model="confirmPassword" name="confirm_pwd" autocomplete="off" placeholder=""><br>

        <label for="fname">First name: </label><br>
        <input type="text" v-model="userData.firstName" name="fname"><br>

        <label for="lname">Last name: </label><br>
        <input type="text" v-model="userData.lastName" name="lname"><br>

        <label v-for="(language, index) in languages" :key="index">
            <input type="radio" :value="language.code" v-model="userData.defaultLanguage" />
            {{ language.label }}
        </label>
    </form>
    <button @click="createUser()">Create account</button>
    <div v-if="correctRegisterPasswords">User succesfull created</div>
    <div v-if="doubleUsernameOrEmail">Username or emailadres already registered.</div>
</template>

<style scoped>
.signup-header {
    color: blue;
    font-weight: bold;
    font-size: 23px;
}

label {
    color: blue;
    font-weight: bold;
    margin-right: 5px;
}

input {
    border: 2px solid grey;
}

button {
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
}

button:hover {
    color: blue;
    background-color: white;
    border: 2px solid blue
}
</style>
