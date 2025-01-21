<script setup lang="ts">
const { label, inputType = "text" } = defineProps<{
  label?: string,
  inputType?: string,
}>();


</script>

<template>
  <label v-if="label">{{ label }}</label>
  <input class="input" :type='inputType' />
</template>

<style scoped>
.input {
  border: 2px solid gray;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
