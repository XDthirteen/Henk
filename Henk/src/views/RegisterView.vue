/*#####################################
/      
/      #  RegisterView.vue
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Het kunnen aanmaken van een gebruiker.
/ 
/      #  Auteur: Arno Defillet 
/      #  Datum aangemaakt: 16/11/2024
/
#################
/
/      Changelog:
/      ----------
/      [DD/MM/JJ] - [User] 
/          - Omschrijving van actie.
/      
/      Opmerkingen:
/      ------------
/      Enige opmerkingen?
/      
#####################################*/

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <h2>Create account</h2>
    <form>
        <label for="email">Email: </label><br>
        <input type="email" id="email" name="email" autocomplete="off" placeholder="example@example.com"><br>
        <label for="pwd">Password: </label><br>
        <input type="password" id="pwd" name="pwd" autocomplete="off"><br>
        <label for="confirm_pwd">Confirm password: </label><br>
        <input type="password" id="confirm_pwd" name="confirm_pwd" autocomplete="off"><br>
        <label for="fname">First name: </label><br>
        <input type="text" id="fname" name="fname"><br>
        <label for="lname">Last name: </label><br>
        <input type="text" id="lname" name="lname"><br>
        <label for="language">Language: </label><br>
        <input type="radio" id="language1" name="fav_language" value="Nederlands">
        <label for="nederlands"> Nederlands </label>
        <input type="radio" id="language2" name="fav_language" value="English">
        <label for="english"> English </label>
    </form>
    <button>Create account</button>
</template>