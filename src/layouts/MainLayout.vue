/*#####################################
/
/ # MainLayout.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # De basis pagina waar alles op ingeladen zal worden
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 15/01/2025
/
#################
/
/ Changelog:
/ Date:--------User:------------Changes:
/ -------------------------------------------------------------------
/ 15/01/2025---Arno Defillet----Start van de layout
/ 15/01/2025---Arno Defillet----Toevoeging : Volledige pagina uitwerken
/ 15/01/2025---Arno Defillet----Toevoeging : CSS toevoegen
/ 25/01/2025---Arno Defillet----Toevoeging : Verplaatsen van de hamburgermenu naar de hoofdlayout
/ 25/01/2025---Arno Defillet----Aanpassing : Styling aanpassen van de menu
/ 10/02/2025---Arno Defillet----Aanpassing : Toevoegen van FontAwesomeIcons
/ 12/02/2025---Arno Defillet----Aanpassing : Verwijderen van redirect to 'login' uit logout en in de service gestoken
/ 03/04/2025---Arno Defillet----Aanpassing : hamburgermenu Tasks navigeren van navigate('tasks') naar
navigate('todo_tasks')
/
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth.service';

const router = useRouter();
const isMenuOpen = ref(false);

const toggleSidebar = () => {
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
  <div class="body">
    <div class="button-container">
      <button class="menu-toggle-button" @click="toggleSidebar">
        {{ isMenuOpen ? '✖' : '☰' }}
      </button>
    </div>

    <!-- Menu-overlay -->
    <div :class="{ 'overlay': true, 'active': isMenuOpen }" @click="toggleSidebar"></div>

    <!-- Hamburger menu -->
    <div :class="{ 'hamburger-menu': true, 'active': isMenuOpen }">
      <!-- Bovenste balk met Home & Profile -->
      <div class="menu-layout">
        <div class="menu-header">
          <div class="small-icon " @click="navigate('home')">
            <font-awesome-icon class="icon" :icon="['fas', 'house']" />
          </div>
          <div class="small-icon" @click="navigate('myAccount')">
            <font-awesome-icon class="icon" :icon="['fas', 'user']" />
          </div>
        </div>

        <!-- Menu items -->
        <div class="menu-organizer">
          <div class="menu-item" @click="navigate('calendar')">
            <font-awesome-icon class="icon" :icon="['fas', 'calendar-days']" />
            <div class="item-text">Calendar</div>
          </div>
          <div class="menu-item" @click="navigate('weather')">
            <font-awesome-icon class="icon" :icon="['fas', 'poo-storm']" />
            <div class="item-text">Weather</div>
          </div>
          <div class="menu-item" @click="navigate('todo_tasks')">
            <font-awesome-icon class="icon" :icon="['fas', 'list-check']" />
            <div class="item-text">My Tasks</div>
          </div>
          <div class="menu-item" @click="navigate('translator')">
            <font-awesome-icon class="icon" :icon="['fas', 'language']" />
            <div class="item-text">Translator</div>
          </div>
        </div>

        <!-- Logout-knop onderaan -->
        <div class="logout-container">
          <div class="menu-item logout-button" @click="logoutAndCloseMenu()">
            <font-awesome-icon class="icon" :icon="['fas', 'right-from-bracket']" />
            <div class="item-text">Logout</div>
          </div>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.body {
  margin: 8px;
  margin-top: 3rem;
}

.button-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 30;
}

.menu-toggle-button {
  background-color: var(--tertiary-purple);
  border-radius: 100%;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #333;
  transition: transform 0.2s ease-in-out;
}

.menu-toggle-button:hover {
  transform: scale(1.1);
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
  background: var(--tertiary-purple);
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
  border-bottom: 4px solid var(--secundary-purple);
  margin-bottom: 1rem;
}

.menu-header .small-icon {
  height: 4rem;
  width: 4rem;
  padding: 8px;
  border-radius: 100%;
  background: var(--primary-purple);
  color: var(--primary-white);
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon {
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
  background: var(--secundary-blue);
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.menu-item:hover {
  background: #e0e0e0;
}

.menu-item img {
  width: 30px;
}

.item-text {
  font-size: large;
  font-weight: 500;
}

.logout-container {
  border-top: 4px solid var(--secundary-purple);
  padding-top: 1rem;
  margin-top: 1rem;
}

.logout-button {
  background: var(--secundary-orange);
  padding: 10px;
  height: 5rem;
  gap: 0;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.logout-button .icon {
  width: 32px;
  height: 32px;
}

.logout-button:hover {
  background: #ffbbbb;
}
</style>
