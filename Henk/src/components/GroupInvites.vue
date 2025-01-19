<template>
  <div class="container">
    <button @click="navigateBack" class="close-button">✖</button>
    <h1>Group invites</h1>

    <div v-if="groupStore.invites.length === 0">
      <p>No invites available.</p>
    </div>

    <div class="invite-container">
      <div
        v-for="group in groupStore.invites"
        :key="group.id"
        class="invite-item"
        @click="openPopup(group)"
      >
        <img :src="group.icon" :alt="group.name" class="invite-icon" />
        <span>{{ group.name }}</span>
      </div>
    </div>

    <div v-if="selectedGroup" class="popup-overlay">
      <div class="popup">
        <h2>Group Invitation</h2>
        <img :src="selectedGroup.icon" :alt="selectedGroup.name" class="popup-icon" />
        <p>{{ selectedGroup.name }}</p>
        <div class="popup-buttons">
          <button class="accept-btn" @click="acceptInvite">Accept</button>
          <button class="decline-btn" @click="declineInvite">Decline</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const groupStore = useGroupStore();
    const router = useRouter();
    const selectedGroup = ref(null);

    const navigateBack = () => {
      router.push('/');
    };

    const openPopup = (group) => {
      selectedGroup.value = group;
    };

    const acceptInvite = () => {
      if (selectedGroup.value) {
        groupStore.acceptGroup(selectedGroup.value);
        selectedGroup.value = null;
      }
    };

    const declineInvite = () => {
      if (selectedGroup.value) {
        groupStore.declineGroup(selectedGroup.value);
        selectedGroup.value = null;
      }
    };

    return { groupStore, navigateBack, selectedGroup, openPopup, acceptInvite, declineInvite };
  },
});
</script>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
  position: relative;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.invite-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.invite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.invite-item:hover {
  transform: scale(1.1);
}

.invite-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 250px;
}

.popup-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.accept-btn {
  background-color: green;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex: 1;
  margin: 5px;
}

.decline-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex: 1;
  margin: 5px;
}
</style>
