#####################################
*/
*/      #  LoginVue.vue
*/      #  ==================
*/      #  Beschrijving:
*/      #  ------------
*/      #  Dit zorgt ervoor dat je kan aanmelden.
*/ 
*/      #  Auteur: Arno Defillet / Gert-Jan Germeys
*/      #  Datum aangemaakt: 11/12/2024
*/
##################
*/
*/      Changelog:
*/      ----------
*/      11/12/2024 - Arno Defillet / Gert-Jan Germeys 
*/          - Creatie van view + uitwerken van loginfunctionaliteit.
*/      16/12/2024 - Arno Defillet 
*/          - Toevoegen van comments
*/          - Toevoegen van boodschap wanneer inloggegevens foutief zijn
*/      
*/      Opmerkingen:
*/      ------------
*/      ...
*/      
#####################################

<script lang="ts" setup>
import axios from 'axios';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Declareer een referentie voor de ingevoerde gebruikersnaam & wachtwoord
const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

// Controleer of er al een authenticatietoken in de lokale opslag staat
// Hiermee wordt bepaald of de gebruiker al ingelogd is
const isAuthenticated = ref(localStorage.getItem("token") !== null);

// Initialiseren van referentie voor verkeerde inloggegevens en default op False zetten
let wrongCredentials :Ref<boolean | undefined> = ref();

// Functie om de gebruiker in te loggen
const login = async (email: string, password: string) => {
    try {
        // Verstuur een POST-verzoek naar de API met de ingevoerde email en wachtwoord
        const response = await axios.post<{token: string}>("/api/auth/login", {
            email: email,
            password: password
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        isAuthenticated.value = true;

    } catch (error) {
        throw new Error(`Login wrong. Error: ${error}`);
    }
}

// Functie om de huidige gebruiker te authenticeren
const authenticate = async() => {
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
    <div>This is the Login view</div>
    <div class="login-container">
        <form>
            <input id="login-username" class="login" type="email" placeholder="example@example.com" v-model="inputUsername" autocomplete="email">
            <input id="login-password" class="login" type="password" placeholder="Your password" v-model="inputPassword" autocomplete="current-password">
            <div class="button-container">
                <button id="login-btn" @click="authenticate()">Login</button>
                <button id="signin-btn" @click="">Sign in</button>
            </div>
            <div v-if="wrongCredentials">Incorrect username - password combination</div>
        </form>
    </div>
</template>

<style scoped>
.login-container{
    display: flex;
    flex-direction: column;
    max-width: 12rem;
}

.button-container{
    display: flex;
}
</style>