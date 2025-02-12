/*#####################################
/
/      #  auth.service.ts
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Alle typescript code dat te maken heeft met het authenticeren van de gebruiker
/
/      #  Auteur: Arno Defillet
/      #  Datum aangemaakt: 16/12/2024
/
#################
/
/      Changelog:
/      ----------
/ Date:--------User:------------Changes:
/ -------------------------------------------------------------------
/ 16/12/2024---Arno Defillet----Toevoegen : Opmaken van service voor "login"
/ 18/12/2024---Arno Defillet----Toevoegen : Opmaken van service voor "logout"
/ 12/02/2024---Arno Defillet----Aanpassing: Redirect to 'login' in functio logout steken
/
/      Opmerkingen:
/      ------------
/      ...
/
#####################################*/

import router from "@/router";
import axios from "axios";
import { ref } from "vue";

// Controleer of er al een authenticatietoken in de lokale opslag staat
// Hiermee wordt bepaald of de gebruiker al ingelogd is
const isAuthenticated = ref(localStorage.getItem("token") !== null);

const useAuth = () => {
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

    // Code om later te gebruiken op een 'logout' button. Deze button staat momenteel op de HomeView.
    const logout = () => {
        localStorage.removeItem("token");
        isAuthenticated.value = false;
        router.push({ name: 'login' });
    }

    return {
        login,
        logout,
        isAuthenticated
    }
}

export { useAuth }
