<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export default {
  setup() {
    const scores = ref([])

    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'scores')
        console.log(scoresCollection)
        const scoreQuery = query(scoresCollection, orderBy('score'), limit(10))
        console.log(scoreQuery)

        const querySnapshot = await getDocs(scoreQuery)
        console.log(querySnapshot)
        scores.value = querySnapshot.docs.map((doc) => doc.data())
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }
    onMounted(fetchScores)

    return {
      scores,
      fetchScores,
    }
  },
}
</script>

<template>
  <div class="scores">
    <h1>High Scores</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores" :key="score.name">
          <td>{{ score.name }}</td>
          <td>{{ score.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.scores {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem;
  border-radius: 2rem;
  background: linear-gradient(45deg, #49a09d, #5f2c82);
}

h1 {
  text-decoration: underline;
}

table {
  border-collapse: collapse;
}

thead {
  border-bottom: 1px solid white;
}

th,
td {
  min-width: 100px;
  padding: 0 0.5rem;
  text-align: left;
}

thead tr {
  border-bottom: 1px solid white;
}
</style>
