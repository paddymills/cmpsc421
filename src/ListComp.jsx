
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { increment } from './reducers/counter'
import { add } from './reducers/list'
import axios from 'axios'

function MyList() {
  const count = useSelector((state => state.counter.value))
  const list = useSelector((state) => state.list.value)
  const dispatch = useDispatch()

  const getTodo = () => {
    dispatch(increment())
    axios.get('https://dummyjson.com/todos/random')
      .then((res) => dispatch(add(res.data.todo)))
  }

  return (
    <div>
      <h1>Todos ({count})</h1>
      <div className="card">
        <button onClick={getTodo}>
          Add Todo
        </button>
        <ul>
          {list.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default MyList
