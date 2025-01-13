<template>
  <div>
    <header>
      <h1>Groups</h1>
      <button class="invite-button" @click="navigateToInvites">
        Invites <span v-if="groupStore.invites.length > 0">({{ groupStore.invites.length }})</span>
      </button>
    </header>
    <div v-if="groupStore.groups.length === 0">
      <p>No groups available.</p>
    </div>
    <ul>
      <li v-for="group in groupStore.groups" :key="group.id" class="group-item">
        <img :src="group.icon" :alt="group.name" class="group-icon" />
        <span>{{ group.name }}</span>
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

    const navigateToInvites = () => {
      router.push('/invites');
    };

    return { groupStore, navigateToInvites };
  },
});
</script>

<style>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.invite-button {
  background: #007bff;
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
li.group-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
img.group-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}
</style>
