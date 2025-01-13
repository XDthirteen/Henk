<template>
  <div>
    <button @click="navigateBack" class="back-button">Back to Groups</button>
    <h1>Group Invites</h1>
    <div v-if="groupStore.invites.length === 0">
      <p>No invites available.</p>
    </div>
    <ul>
      <li v-for="group in groupStore.invites" :key="`group-invite-${group.id}`" class="invite-item">
        <img :src="group.icon" :alt="group.name" class="invite-icon" />
        <span>{{ group.name }}</span>
        <button @click="groupStore.acceptGroup(group)">Accept</button>
        <button @click="groupStore.declineGroup(group)">Decline</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const groupStore = useGroupStore();
    const router = useRouter();

    const navigateBack = () => {
      router.push('/');
    };

    return { groupStore, navigateBack };
  },
});
</script>

<style>
.back-button {
  margin-bottom: 20px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li.invite-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
img.invite-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}
button {
  margin-left: 10px;
}
</style>
