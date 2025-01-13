<template>
  <div>
    <h2>Group Invitation</h2>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <span>{{ group.icon }}</span>
        <span>{{ group.name }}</span>
        <button @click="$emit('accept', group)">Accept</button>
        <button @click="$emit('decline', group)">Decline</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import type { PropType } from 'vue';
import type { Group } from '../types/Group';

export default defineComponent({
  props: {
    groups: {
      type: Array as PropType<Group[]>,
      required: true,
    },
  },
});
</script>

<style>
li {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
button {
  margin-left: 10px;
}
</style>
