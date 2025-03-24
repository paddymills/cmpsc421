import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Game from '../views/GameView.vue'
import Scores from '../views/ScoresView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/scores',
      name: 'scores',
      component: Scores,
    },
  ],
})

export default router
