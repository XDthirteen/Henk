<script setup lang="ts">
import { RouterView } from 'vue-router'
import { userSettings } from './services/userSettings.service';
import { onMounted } from 'vue';

const settings = userSettings();

onMounted(() => {
  settings.getUserParam();
});
</script>

<template>

  <body class="body">
    <RouterView />
  </body>
</template>

<style scoped>
.body {
  background-color: var(--main-background);
}
</style>
