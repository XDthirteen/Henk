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
      <div class="group-item main-group">
        <img :src="groupStore.meGroup.icon" alt="Me" />
        <span>{{ groupStore.meGroup.name }}</span>
      </div>

      <div v-for="group in groupStore.groups" :key="group.id" class="group-item">
        <img :src="group.icon" :alt="group.name" />
        <span>{{ group.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupStore } from '@/stores/groupStore'
import { useRouter } from 'vue-router'

const groupStore = useGroupStore()
const router = useRouter()

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
}

.group-item img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
</style>
