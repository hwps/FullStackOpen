import { useSelector, useDispatch } from 'react-redux'
import { upvoteAnecdote } from './reducers/anecdoteReducer'

import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  // fetch anecdotes from store and sort according to likes
  const anecdotes = useSelector(state => state)
  anecdotes.sort((a, b) => {
    if (a.votes === b.votes) return 0
    else return a.votes > b.votes ? -1 : 1
  })
  const dispatch = useDispatch()

  // 
  const handleUpvote = (id) => {
    console.log('vote', id)
    dispatch(upvoteAnecdote(id))
  }



  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleUpvote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App