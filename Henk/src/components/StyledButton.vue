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
  background-color: #eeeeee;
  border-radius: 0.25rem;
  font-weight: 500;
  border: none;
  color: #567868;
}

button:hover {
  background-color: #e6e6e6;
  color: #0096e8;
  cursor: pointer;
}


.primary {
  color: white;
  background-color: #453d83;
  border: 2px solid #453d83;
}

.primary:hover {
  color: #453d83;
  background-color: white;
  border: 2px solid #453d83
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
