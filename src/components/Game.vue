<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      min-height="600px"
      max-width="900"
      style="height: 100%"
    >
      <div class="text-center">
        <h1>Dance Dance ReVuelution</h1>
      </div>
      <div class="text-center game-container">
        <div class="game-area">
          <p>Score: {{ score }}</p>
          <p>Health: {{ health }}</p>
          <img
            v-for="(arrow, index) in arrows"
            :key="index"
            src="@/assets/logo.svg"
            alt="Logo"
            :class="[
              'arrow',
              `arrow-${arrow.direction}`,
              arrow.y > 90 ? 'arrow-finished' : '',
            ]"
            :style="{ top: `${arrow.y}%` }"
            height="50"
            width="50"
          />
        </div>
        <div class="zone"></div>
      </div>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const arrowDirections = ["left", "right", "up", "down"];

const initialPostition = 5;
const speed = 100;
const lastArrowTicksAgo = ref(0);
const arrows = ref([]);
const score = ref(0);
const health = ref(5);
const createArrow = () => {
  const arrow = {
    y: initialPostition,
    direction:
      arrowDirections[Math.floor(Math.random() * arrowDirections.length)],
  };
  console.log(arrow);
  arrows.value.push(arrow);
};

const maybeCreateArrow = () => {
  lastArrowTicksAgo.value += 1;
  if (lastArrowTicksAgo.value < 6) return;

  const value = Math.random() * 10 + lastArrowTicksAgo.value;

  // create an arrow
  if (value > 9.2) {
    createArrow();
  }
  if (value > 15) {
    createArrow();
  }

  lastArrowTicksAgo.value = 0;
};

const advanceArrows = () => {
  // console.log("moving arrows");
  arrows.value.forEach((arrow) => {
    arrow.y += 1;
  });
};

const checkInput = (direction) => {
  for (let i = 0; i < arrows.value.length; i++) {
    const arrow = arrows.value[i];
    if (arrow.direction === direction && arrow.y >= 90) {
      arrows.value.splice(i, 1);
      score.value += 1;

      // evaluate health (add health every 5 points)
      if (health.value < 5 && score.value % 5 === 0) {
        health.value += 1;
      }

      return;
    }
  }

  // no matching arrow found in the zone
  // Scorekeeper: deduct one life!
  health.value -= 1;
};

const checkFinished = () => {
  const preLength = arrows.value.length;

  // remove finished
  arrows.value = arrows.value.filter((arrow) => arrow.y <= 100);

  const postLength = arrows.value.length;

  health.value -= preLength - postLength;
};

const tick = () => {
  maybeCreateArrow();
  advanceArrows();
  checkFinished();
};

// Initialize game logic here
setInterval(tick, speed);

// react to keyboard input (arrow keys, WASD, vim keys)
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
    case "a":
    case "h":
      // handle left arrow key press
      console.log("Left arrow key pressed");
      checkInput("left");
      break;
    case "ArrowRight":
    case "d":
    case "l":
      // handle right arrow key press
      console.log("Right arrow key pressed");
      checkInput("right");
      break;
    case "ArrowUp":
    case "w":
    case "k":
      // handle up arrow key press
      console.log("Up arrow key pressed");
      checkInput("up");
      break;
    case "ArrowDown":
    case "s":
    case "j":
      // handle down arrow key press
      console.log("Down arrow key pressed");
      checkInput("down");
      break;
    default:
      // handle other key presses
      console.log("Other key pressed:", event.key);
      break;
  }
});
</script>

<style scoped>
.game-container {
  height: 94%;
  margin: 1rem;
  border-radius: 1rem;
  background: slategrey;
}

.zone {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 70px;
  border: 5px solid white;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.arrow {
  position: absolute;
  left: 50%;
  top: 50%;
}

.arrow-finished {
  opacity: 0.5;
}

.arrow-left {
  left: 15%;
  rotate: 90deg;
}

.arrow-up {
  left: 35%;
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
