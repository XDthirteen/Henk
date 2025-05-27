import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/house-style.css'
import { applyTheme } from './services/userSettings.service'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCalendarDays,
  faHouse,
  faLanguage,
  faListCheck,
  faPooStorm,
  faRightFromBracket,
  faUser,
  faPenToSquare,
  faFloppyDisk,
  faCircle,
  faCheckCircle,
  faCircleNotch,
  faPlus,
  faXmark,
  faBars,
  faUserGroup,
  faFaceGrinTongueWink
} from '@fortawesome/free-solid-svg-icons'

// Search icons on https://fontawesome.com/icons
// when class is fa-house, add faHouse to library.add
// in template gebruik je dit zo:
//    <font-awesome-icon class="icon" :icon="['fas', 'language']" />



library.add(
  faHouse,
  faUser,
  faCalendarDays,
  faPooStorm,
  faListCheck,
  faLanguage,
  faRightFromBracket,
  faPenToSquare,
  faFloppyDisk,
  faCircle,
  faCheckCircle,
  faCircleNotch,
  faPlus,
  faXmark,
  faBars,
  faUserGroup,
  faFaceGrinTongueWink
);

const savedTheme = localStorage.getItem('selectedTheme') || 'light';
applyTheme(savedTheme);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')
