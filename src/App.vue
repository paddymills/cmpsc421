<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game">Game</RouterLink>
      <RouterLink to="/scores">Scores</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
