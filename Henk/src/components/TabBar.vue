<template>
  <nav class="tab-bar">
    <router-link to="/invites">Group Invites</router-link>
    <router-link to="/groups">Groups</router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style>
.tab-bar {
  display: flex;
  justify-content: space-around;
  background: #f5f5f5;
  padding: 10px;
}
</style>
