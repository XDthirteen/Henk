/*#####################################
/
/      #  LoginVue.vue
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Dit zorgt ervoor dat je kan aanmelden.
/
/      #  Auteur: Arno Defillet / Gert-Jan Germeys
/      #  Datum aangemaakt: 11/12/2024
/
#################
/
/      Changelog:
/      ----------
/      11/12/2024 - Arno Defillet / Gert-Jan Germeys
/          - Creatie van view + uitwerken van loginfunctionaliteit.
/      16/12/2024 - Arno Defillet
/          - Toevoegen van comments
/          - Toevoegen van boodschap wanneer inloggegevens foutief zijn
/          - Alle service code verplaatst naar services -> auth.service.ts
/      Opmerkingen:
/      ------------
/      ...
/
#####################################*/

<script lang="ts" setup>
import { useAuth } from '@/services/auth.service';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { login } = useAuth();

// Declareer een referentie voor de ingevoerde gebruikersnaam & wachtwoord
const inputUsername: Ref<string> = ref("");
const inputPassword: Ref<string> = ref("");

// Initialiseren van referentie voor verkeerde inloggegevens en default op False zetten
const wrongCredentials :Ref<boolean | undefined> = ref();

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
    <div class="login-header">HENK</div>
    <div class="login-container" >
        <form>
            <input id="login-username" type="email" placeholder="example@example.com" v-model="inputUsername" autocomplete="email">
            <input id="login-password" type="password" placeholder="Your password" v-model="inputPassword" autocomplete="current-password">
        </form>
        <div class="button-container">
            <button id="login-btn" @click="authenticate()">Login</button>
            <button id="signin-btn" @click="router.push({name: 'signin'})">Sign up</button>
        </div>
        <div v-if="wrongCredentials">Incorrect username - password combination</div>
    </div>
</template>

<style scoped>



.login-header{
    color: blue;
    font-weight: bold;
    font-size: 50px;
}

.login-container{
    display: flex;
    flex-direction: column;
    max-width: 12rem;
    align-items: center;
}

.button-container{
    display: flex;
}

#login-btn{
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
#login-btn:hover{
    color: blue;
    background-color: white;
    border: 2px solid blue
}

#signin-btn{
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
#signin-btn:hover{
    color: blue;
    background-color: white;
    border: 2px solid blue;
}

#login-username{
    border: 2px solid gray;
    margin: 1px;
}

#login-password{
    border: 2px solid gray;
    margin: 1px;
}
</style>
