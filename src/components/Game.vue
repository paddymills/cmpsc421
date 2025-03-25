<script setup>
import { ref } from 'vue'
import { addDoc, collection } from '@firebase/firestore'
import { db } from '../firebase'

const arrowDirections = ['left', 'right', 'up', 'down']

const initialPostition = 5

// difficulty (easy, medium, hard)
const difficulty = ref('easy')

const speed = ref(500)
const lastArrowTicksAgo = ref(10)
const arrows = ref([])
const score = ref(0)
const health = ref(100)

const gameState = ref('playing')
const showInstructionsDialog = ref(false)
const showSubmitDialog = ref(false)
const name = ref('')

const createArrow = () => {
  const arrow = {
    y: initialPostition,
    direction: arrowDirections[Math.floor(Math.random() * arrowDirections.length)],
  }
  // console.log(arrow)
  arrows.value.push(arrow)
}

const submitScore = async () => {
  // TODO: submit score to server
  try {
    const docRef = await addDoc(collection(db, 'scores'), {
      score: score.value,
      difficulty: difficulty.value,
      name: name.value,
    })
    console.log('Document written with ID: ', docRef.id)
    alert('Score submitted!')
    document.reload()
  } catch (error) {
    console.error('Error adding document: ', error)
    alert('Error submitting score')
  }
}

const maybeCreateArrow = () => {
  lastArrowTicksAgo.value += 1
  if (lastArrowTicksAgo.value < 6) return

  const value = Math.random() * 10 + lastArrowTicksAgo.value

  // create an arrow
  if (value > 12) {
    createArrow()
  }

  lastArrowTicksAgo.value = 0
}

const advanceArrows = () => {
  // console.log("moving arrows");
  arrows.value.forEach((arrow) => {
    arrow.y += 1
  })
}

const checkInput = (direction) => {
  for (let i = 0; i < arrows.value.length; i++) {
    const arrow = arrows.value[i]
    if (arrow.direction === direction && arrow.y >= 90) {
      arrows.value.splice(i, 1)
      score.value += 1

      // evaluate health
      if (health.value < 100) {
        health.value += 1
      }

      return
    }
  }

  // no matching arrow found in the zone
  // Scorekeeper: deduct one life!
  health.value -= 10
}

const checkFinished = () => {
  const preLength = arrows.value.length

  // remove finished
  arrows.value = arrows.value.filter((arrow) => arrow.y <= 100)

  const postLength = arrows.value.length

  // lose 5 health for each arrow missed
  health.value -= (preLength - postLength) * 5

  if (health.value <= 0) {
    gameState.value = 'gameover'
    showSubmitDialog.value = true
  }
}

const tick = () => {
  if (gameState.value !== 'playing') {
    return
  }

  maybeCreateArrow()
  advanceArrows()
  checkFinished()

  // increment speed (cap speed at 50ms)
  if (speed.value > 50) {
    speed.value -= 1
  }

  switch (difficulty.value) {
    case 'easy':
      setTimeout(tick, speed.value + 100)
      break
    case 'medium':
      setTimeout(tick, speed.value + 50)
      break
    case 'hard':
      setTimeout(tick, speed.value + 25)
      break
  }

  // setTimeout(tick, speed.value)
}

// Initialize game logic here
tick()

// react to keyboard input (arrow keys, WASD, vim keys)
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'h':
      // handle left arrow key press
      console.log('Left arrow key pressed')
      checkInput('left')
      break
    case 'ArrowRight':
    case 'd':
    case 'l':
      // handle right arrow key press
      console.log('Right arrow key pressed')
      checkInput('right')
      break
    case 'ArrowUp':
    case 'w':
    case 'k':
      // handle up arrow key press
      console.log('Up arrow key pressed')
      checkInput('up')
      break
    case 'ArrowDown':
    case 's':
    case 'j':
      // handle down arrow key press
      console.log('Down arrow key pressed')
      checkInput('down')
      break
    case 'Escape':
      // handle escape key press
      console.log('Escape key pressed')
      gameState.value = 'paused'
      break
    default:
      // handle other key presses
      console.log('Other key pressed:', event.key)
      break
  }
})
</script>

<template>
  <div class="stats">
    <p>Score: {{ score }}</p>
    <p>Life: {{ health }}</p>
    <p>Difficulty: {{ difficulty }}</p>
    <v-radio-group v-model="difficulty">
      <v-radio label="Easy" color="primary" value="easy"></v-radio>
      <v-radio label="Medium" color="primary" value="medium"></v-radio>
      <v-radio label="Hard" color="primary" value="hard"></v-radio>
    </v-radio-group>
    <div>
      <v-btn @click="showInstructionsDialog = true">Instructions</v-btn>
      <v-dialog v-model="showInstructionsDialog" width="auto">
        <v-card max-width="500" prepend-icon="mdi-update" title="Instructions">
          <v-card-text>
            <p>Controls are: Arrow keys, WASD and VIM bindings.</p>
            <p>You lose 5 points for each missed arrow.</p>
            <p>You lose 10 points for each wrong arrow.</p>
            <p>You gain 1 point for each correct arrow.</p>
            <p>Deal with it! Life isn't fair!</p>
          </v-card-text>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="Ok" @click="showInstructionsDialog = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </div>
  <div class="container">
    <div class="title">
      <h1>Dance Dance ReVuelution</h1>
    </div>
    <div class="game-container">
      <img
        v-for="(arrow, index) in arrows"
        :key="index"
        src="@/assets/logo.svg"
        alt="Logo"
        :class="['arrow', `arrow-${arrow.direction}`, arrow.y > 90 ? 'arrow-finished' : '']"
        :style="{ top: `${arrow.y}%` }"
        height="50"
        width="50"
      />
    </div>
    <div class="zone"></div>
  </div>
  <div>
    <v-dialog v-model="showSubmitDialog" width="auto">
      <v-card max-width="500" prepend-icon="mdi-update" title="Submit Score">
        <v-card-text>
          <p>Enter your name:</p>
          <v-text-field v-model="name" label="Name"></v-text-field>
          <p>Score: {{ score }}</p>
        </v-card-text>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Submit" @click="submitScore"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.stats {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  background: linear-gradient(45deg, #49a09d, #5f2c82);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  width: 80%;
  max-width: 900px;
}

.title {
  flex: 0 1 auto;
}

.game-container {
  display: flex;
  /* flex-direction: column; */
  flex: 1 1 auto;
  width: 100%;

  margin: 1rem;
  border-radius: 1rem;
  background: slategrey;
}

.zone {
  position: relative;
  top: -80px;
  height: 70px;
  width: 100%;
  border: 5px solid white;
  border-radius: 1rem;
  background: linear-gradient(45deg, #49a09d, #5f2c82);
}

.arrow {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
}

.arrow-finished {
  opacity: 0.5;
}

.arrow-left {
  left: 20%;
  rotate: 90deg;
}

.arrow-up {
  left: 40%;
  rotate: 180deg;
}

.arrow-down {
  left: 60%;
}

.arrow-right {
  left: 80%;
  rotate: -90deg;
}
</style>
