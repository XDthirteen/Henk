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
  border: 0.5rem solid red;
  border-radius: 10px;
  background-color: var(--main-red);
  font-weight: bold;
}
</style>
