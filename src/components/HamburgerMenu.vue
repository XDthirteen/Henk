/*#####################################
/
/ # HamburgerMenu.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Het hamburger icoontje met ingebouwde menu
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 17/04/2025
/
#################
/
/ Changelog:
/ ----------
/ 17/04/2025---Arno Defillet----Start van de component, volledige menu + icoon uitgewerkt
/ 26/05/2025---Arno Defillet----Aanpassing: Translator aangepast naar Jokes
/
/ To do:
/ -
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import FontAwasomeIconToggler from './FontAwasomeIconToggler.vue';
import router from '@/router';
import { useAuth } from '@/services/auth.service';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigate = (routeName: string) => {
  router.push({ name: routeName });
  isMenuOpen.value = false;
};

const { logout } = useAuth();
const logoutAndCloseMenu = () => {
  logout();
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="button-container">
    <div class="small-icon">
      <FontAwasomeIconToggler class="hamburg-icon" icon1="xmark" icon2="bars" :active="isMenuOpen"
        @toggle="toggleMenu" />
    </div>
  </div>

  <!-- Menu-overlay -->
  <div :class="{ 'overlay': true, 'active': isMenuOpen }" @click="toggleMenu"></div>

  <!-- Hamburger menu -->
  <div :class="{ 'hamburger-menu': true, 'active': isMenuOpen }">
    <!-- Bovenste balk met Home & Profile -->
    <div class="menu-layout">
      <div class="menu-header">
        <div class="small-icon " @click="navigate('home')">
          <font-awesome-icon class="icons" :icon="['fas', 'house']" />
        </div>
        <div class="small-icon" @click="navigate('myAccount')">
          <font-awesome-icon class="icons" :icon="['fas', 'user']" />
        </div>
      </div>

      <!-- Menu items -->
      <div class="menu-organizer">
        <div class="menu-item" @click="navigate('calendar')">
          <font-awesome-icon class="icons" :icon="['fas', 'calendar-days']" />
          <div class="item-text">Calendar</div>
        </div>
        <div class="menu-item" @click="navigate('weather')">
          <font-awesome-icon class="icons" :icon="['fas', 'poo-storm']" />
          <div class="item-text">Weather</div>
        </div>
        <div class="menu-item" @click="navigate('todo_tasks')">
          <font-awesome-icon class="icons" :icon="['fas', 'list-check']" />
          <div class="item-text">My Tasks</div>
        </div>
        <div class="menu-item" @click="navigate('jokes')">
          <font-awesome-icon class="icons" :icon="['fas', 'language']" />
          <div class="item-text">Jokes</div>
        </div>
      </div>

      <!-- Logout-knop onderaan -->
      <div class="logout-container">
        <div class="menu-item logout-button" @click="logoutAndCloseMenu()">
          <font-awesome-icon class="icons" :icon="['fas', 'right-from-bracket']" />
          <div class="item-text">Logout</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 30;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
  z-index: 10;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

.hamburger-menu {
  position: fixed;
  height: 40rem;
  min-height: 15rem;
  top: 25rem;
  left: 50%;
  width: 80%;
  min-width: 240px;
  max-width: 320px;
  background: var(--second-background);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 24px;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  z-index: 20;
  border: 4px solid rgb(77, 75, 75);
  pointer-events: none;
  /* Standaard geen klikken mogelijk */
}

.hamburger-menu.active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
  /* Als de menu actief is, wordt klikken toegestaan */
}

.menu-layout {
  width: 100%;
  height: 90%;
}

.menu-header {
  display: flex;
  justify-content: space-around;
  gap: 3rem;
  width: 100%;
  height: 15%;
  border-bottom: 4px solid var(--input-border);
  margin-bottom: 1rem;
}

.hamburg-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.small-icon {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  background: var(--primary-button);
  color: var(--main-text);
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-header .small-icon {
  height: 4rem;
  width: 4rem;
}

.icons {
  width: 40px;
  height: 40px;
  margin-bottom: 3px;
}

.menu-organizer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-content: flex-start;
  gap: 12px;
  width: 100%;
  height: 60%;
}

.menu-item {
  display: flex;
  flex-direction: column;
  height: 6rem;
  width: 6rem;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: var(--item-background);
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.menu-item img {
  width: 30px;
}

.item-text {
  font-size: large;
  font-weight: 500;
}

.logout-container {
  border-top: 4px solid var(--input-border);
  padding-top: 1rem;
  margin-top: 1rem;
}

.logout-button {
  background: var(--main-red);
  padding: 10px;
  height: 5rem;
  gap: 0;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.logout-button .icons {
  width: 32px;
  height: 32px;
}

@media screen and (max-width: 360px) {
  .menu-item{
    height: 4.5rem;
    width: 4.5rem;
  }
  .icons{
    width: 25px;
    height: 25px;
  }
  .item-text{
    font-size: smaller;
  }
}

@media screen and (max-height: 730px) {
  .hamburger-menu{
    height: 30rem;
    top: 18rem;
  }
}
</style>
