#####################################
*/
*/      #  LoginVue.vue
*/      #  ==================
*/      #  Beschrijving:
*/      #  ------------
*/      #  Dit zorgt ervoor dat je kan aanmelden.
*/ 
*/      #  Auteur: Arno Defillet
*/      #  Datum aangemaakt: 11/12/2024
*/
##################
*/
*/      Changelog:
*/      ----------
*/      11/12/2024 - Creatie van view + uitwerken van loginfunctionaliteit.
*/      16/12/2024 - Toevoegen van comments
*/      
*/      Opmerkingen:
*/      ------------
*/      ...
*/      
#####################################

<script lang="ts" setup>
import axios from 'axios';
import { ref, type Ref } from 'vue';

// Declareer een referentie voor de ingevoerde gebruikersnaam & wachtwoord
const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

// Controleer of er al een authenticatietoken in de lokale opslag staat
// Hiermee wordt bepaald of de gebruiker al ingelogd is
const isAuthenticated = ref(localStorage.getItem("token") !== null);

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
        console.log('Succesfull authenticated')
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div>This is the Login view</div>
    <div class="login-container">
        <input id = "login-username" class="login" type="email" placeholder="example@example.com" v-model="inputUsername">
        <input id = "login-password" class="login" type="password" placeholder="Your password" v-model="inputPassword">
        <button id="login-btn" @click="authenticate()">Login</button>
    </div>
</template>

<style scoped>
.login-container{
    display: flex;
    flex-direction: column;
    max-width: 12rem;
}
</style>