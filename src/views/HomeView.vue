<script setup>
// import Game from '../components/Game.vue'
</script>

<template>
  <main>
    <h1>Welcome to the Game!</h1>
    <a href="/game">Start Game</a>
    <a href="/scores">Scores</a>
  </main>
</template>

<style scoped>
main {
  border: 3px solid white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
