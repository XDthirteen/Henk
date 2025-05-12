import './assets/main.css'
import './assets/house-style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importeer FontAwesome setup
import './fontawesome'

// Importeer de FontAwesome component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Maak de Vue-app
const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registreer de FontAwesome component globaal
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
