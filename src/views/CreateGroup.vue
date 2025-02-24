<template>
  <div class="container">
    <header>
      <h1>Groups</h1>
      <div class="header-buttons">
        <button class="invite-button" @click="navigateToInvites" v-if="groupStore.invites.length > 0">
          <span class="invite-badge">{{ groupStore.invites.length }}</span>
        </button>
        <button class="menu-button" @click="toggleSidebar">☰</button>
      </div>
    </header>

    <div class="group-container">
      <div class="group-item main-group">
        <img :src="groupStore.meGroup.icon" alt="Me" />
        <span>{{ groupStore.meGroup.name }}</span>
      </div>
      <div v-for="group in groupStore.groups" :key="group.id" class="group-item">
        <img :src="group.icon" :alt="group.name" />
        <span>{{ group.name }}</span>
      </div>
    </div>

    <!-- Zijmenu -->
    <div v-if="isSidebarOpen" class="sidebar">
      <button class="close-button" @click="toggleSidebar">✖</button>
      <h2>Menu</h2>
      <ul>
        <li @click="showAddGroupForm">Add new group</li>
        <li @click="navigateTo('')">Invite members</li>
        <li @click="navigateTo('')">Leave group</li>
      </ul>
    </div>

    <!-- Formulier voor groep toevoegen -->
    <div v-if="isAddGroupFormOpen" class="add-group-form">
      <h2>Add New Group</h2>
      <div class="logo-upload">
        <div class="logo-placeholder" @click="showIconPicker = true">
          <img v-if="selectedIcon" :src="selectedIcon" />
          <template v-else>+</template>
        </div>
        <p>Select a group icon</p>
        <div v-if="showIconPicker" class="icon-picker">
          <img
            v-for="icon in availableIcons"
            :key="icon"
            :src="icon"
            class="icon"
            @click="selectIcon(icon)"
          />
        </div>
      </div>
      <input type="text" v-model="groupName" placeholder="Enter group name" class="input-field" />
      <input type="text" v-model="inviteInput" placeholder="Enter ID or email" class="input-field" />
      <div class="form-buttons">
        <button class="send-btn" @click="sendInvite">Send Invite</button>
        <button class="cancel-btn" @click="resetForm">Cancel</button>
      </div>
      <p v-if="inviteSent" class="invite-sent-message">Invite Sent</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/groupStore'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/services/auth.service' // ✅ Auth service importeren

const groupStore = useGroupStore()
const router = useRouter()
const { getAuthToken, isAuthenticated } = useAuth() // ✅ Token ophalen via auth service

// UI states
const isSidebarOpen = ref(false)
const isAddGroupFormOpen = ref(false)
const showIconPicker = ref(false)

// Form data
const selectedIcon = ref<string | null>(null)
const inviteInput = ref('')
const groupName = ref('')
const inviteSent = ref(false)

// Beschikbare icons
const availableIcons = [
  '../src/assets/airplane.png',
  '../src/assets/videogame.png',
  '../src/assets/dog.png',
  '../src/assets/couplekiss.png',
  '../src/assets/joy.png',
  '../src/assets/man-woman-boy.png',
  '../src/assets/sleepy.png',
  '../src/assets/soccer.png',
  '../src/assets/grinning.png',
  '../src/assets/smile-cat.png',
]

const randomIcons = ref<string[]>([])

// API gegevens
const API_URL = '/api/groups'

// Navigatie functies
const navigateToInvites = () => {
  router.push({ name: 'invites' })
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const navigateTo = (path: string) => {
  router.push(path)
  isSidebarOpen.value = false
}

// Groep aanmaken
const showAddGroupForm = () => {
  isAddGroupFormOpen.value = true
  isSidebarOpen.value = false
  randomIcons.value = getRandomIcons(availableIcons, 4)
}

const selectIcon = (icon: string) => {
  selectedIcon.value = icon
  showIconPicker.value = false
}

const getRandomIcons = (icons: string[], count: number) => {
  const shuffled = [...icons].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Verzenden van de uitnodiging
const sendInvite = async () => {
  if (!inviteInput.value.trim() || !groupName.value.trim()) {
    alert('Please fill in all fields.')
    return
  }

  // ✅ Controleer of de gebruiker is ingelogd
  if (!isAuthenticated.value) {
    alert('You are not authenticated. Please log in again.')
    return
  }

  const token = getAuthToken()
  console.log('Gebruikt token:', token) // ✅ Debugging

  try {
    const response = await axios.post(
      API_URL,
      {
        name: groupName.value,
        icon: selectedIcon.value || '',
        invite: inviteInput.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 201) {
      inviteSent.value = true
      setTimeout(() => {
        inviteSent.value = false
        resetForm()
      }, 2000)
    } else {
      alert('Something went wrong, please try again.')
    }
  } catch (error: unknown) {
    console.error('Error creating group:', error)

    let errorMsg = 'Failed to create the group.'

    if (axios.isAxiosError(error) && error.response) {
      errorMsg = error.response.data?.message || errorMsg
    }

    alert(errorMsg)
  }
}

// Formulier resetten
const resetForm = () => {
  inviteInput.value = ''
  groupName.value = ''
  selectedIcon.value = null
  isAddGroupFormOpen.value = false
}
</script>


<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.header-buttons {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
}

.menu-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;
}

.invite-button {
  background: none;
  border: none;
  cursor: pointer;
}

.invite-badge {
  background-color: green;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.main-group {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group-item img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease-in-out;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
}

.sidebar li:hover {
  background: #f0f0f0;
}

.add-group-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin: 20px auto;
}

.logo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo-placeholder {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #9e9e9e;
  margin-bottom: 10px;
}

.logo-placeholder img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.send-btn,
.cancel-btn {
  flex: 1;
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.send-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.send-btn:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.cancel-btn:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

.icon-picker {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.icon {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.3s;
}

.icon:hover {
  transform: scale(1.1);
}

.invite-sent-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}
</style>
