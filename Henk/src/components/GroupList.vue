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

    <div v-if="isSidebarOpen" class="sidebar">
      <button class="close-button" @click="toggleSidebar">✖</button>
      <h2>Menu</h2>
      <ul>
        <li @click="navigateTo('')">Settings</li>
        <li @click="navigateTo('')">Profile</li>
        <li @click="navigateTo('')">Logout</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'vue-router';

const groupStore = useGroupStore();
const router = useRouter();
const isSidebarOpen = ref(false);

const navigateToInvites = () => {
  router.push({ name: 'invites' });
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const navigateTo = (path: string) => {
  router.push(path);
  isSidebarOpen.value = false;
};
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
</style>
