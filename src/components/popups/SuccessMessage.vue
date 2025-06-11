<template>
  <p>
    <slot />
  </p>
</template>

<style scoped>
p {
  display: flex;
  justify-content: center;
  padding: 0.2rem;
  border: 0.5rem solid var(--hover-green);
  border-radius: 10px;
  background-color: var(--green-button);
  font-weight: bold;
}
</style>