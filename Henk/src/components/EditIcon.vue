<script lang="ts" setup>

function myFunction() {
  console.log('HelloWorld')
}

</script>

<template>
  <img class="edit-image" src="/images/Edit_icon.png" @click="myFunction">
</template>

<style scoped>
.edit-image {
  background-color: var(--secundary-purple);
  border-radius: 100%;
  width: 10%;
}

button {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
</style>
