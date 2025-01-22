<script lang="ts" setup>
type ButtonType = "default" | "primary" | "negative";
defineProps<{ type?: ButtonType }>()
</script>

<template>
  <button :class="{ 'primary': type === 'primary', 'negative': type === 'negative' }">
    <slot />
  </button>
</template>

<style scoped>
button {
  border-radius: 10px;
  padding: 0.2rem 1rem 0.2rem 1rem;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  margin: 5px;
  background-color: var(--secundary-white);
  border-radius: 0.25rem;
  font-weight: 500;
  border: none;
  color: var(--primary-purple);
}

button:hover {
  background-color: var(--secundary-orange);
  color: var(--primary-purple);
  cursor: pointer;
}


.primary {
  background-color: var(--primary-purple);
  color: var(--primary-white);
  border: 2px solid var(--primary-purple);
}

.primary:hover {
  background-color: var(--primary-white);
  color: var(--primary-purple);
  border: 2px solid var(--primary-purple)
}

.negative {
  background-color: #c10015;
  color: #fff;
}

.negative:hover {
  background-color: #9b0012;
  color: #fff;
}
</style>
