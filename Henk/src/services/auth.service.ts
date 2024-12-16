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
/      [DD/MM/JJ] - [User]- Omschrijving van actie.
/      
/      Opmerkingen:
/      ------------
/      ...
/      
#####################################*/

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
    
    return {
        login,
        isAuthenticated
    }
}

export { useAuth }