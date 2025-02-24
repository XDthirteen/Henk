<template>
  <div class="container">
    <header>
      <h1>Groups</h1>

      <div class="header-buttons">
        <button class="invite-button" @click="navigateToInvites" v-if="groupStore.invites.length > 0">
          <span class="invite-badge">{{ groupStore.invites.length }}</span>
        </button>
      </div>
    </header>

    <div class="group-container">
      <div class="group-item main-group" v-if="groupStore.meGroup">
        <img :src="groupStore.meGroup.icon" alt="Me" />
        <span>{{ groupStore.meGroup.name }}</span>
      </div>

      <div v-if="loading">Loading groups...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-for="group in groups" :key="group.id" class="group-item">
          <img :src="group.icon" :alt="group.name" />
          <span>{{ group.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="isSidebarOpen" class="sidebar">
      <button class="close-button" @click="toggleSidebar">✖</button>
      <h2>Menu</h2>
      <ul>
        <li @click="navigateTo('')">Home</li>
        <li @click="navigateTo('')">Profile</li>
        <li @click="navigateTo('')">Logout</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGroupStore } from '@/stores/groupStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const groupStore = useGroupStore()
const router = useRouter()
const isSidebarOpen = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
interface Group {
  id: number
  name: string
  icon: string
}

const groups = ref<Group[]>([])

const API_URL = 'https://syntra-20242025-henk-api.onrender.com/api/groups'
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczOTk5NzI1MCwiZXhwIjoxNzQwMDAwODUwfQ.JUNZFBKE6MKYwfUcQojVjFHNbUEfKq_p85wRNZUD-u4'

const fetchGroups = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    })
    groups.value = response.data
  } catch (err) {
    console.error('Error fetching groups:', err)
    error.value = 'Failed to load groups.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchGroups)

const navigateToInvites = () => {
  router.push({ name: 'invites' })
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
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.group-item:hover {
  transform: scale(1.05);
}

.group-item img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
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

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
