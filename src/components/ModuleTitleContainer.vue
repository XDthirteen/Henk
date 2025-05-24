<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
h1 {
  display: flex;
  color: var(--main-text);
  border: 2px solid var(--title-border);
  border-radius: 10px;
  background-color: var(--title-background);
  margin: 1rem 2rem 1rem 2rem;
  padding: 0.5rem;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: xx-large;
  height: 5rem;
}
</style>
