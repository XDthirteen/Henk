/*#####################################
/      
/      #  authenticationGuard
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Het redirected naar de login-pagina indien er geen token in de localStorage zit.
/ 
/      #  Auteur: Arno Defillet 
/      #  Datum aangemaakt: 16/11/2024
/
#################
/
/      Changelog:
/      ----------
/      08/01/2025 - Arno Defillet  
/          - Aanmaken van de authenticationGuard
/      
/      Opmerkingen:
/      ------------
/      /
/      
#####################################*/

import { useAuth } from "@/services/auth.service";
import { useRouter, type RouteLocation } from "vue-router";


export const authenticationGuard = (_to: RouteLocation, _from: RouteLocation) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if(isAuthenticated.value){
        return true;
    } else {
        console.log("Redirected to 'Login' because no authenticated user.")
        router.push({ name: 'login'});
        return false;
    }
}