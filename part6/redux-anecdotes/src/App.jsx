import { useSelector, useDispatch } from 'react-redux'
import { upvoteAnecdote, createAnecdote } from './reducers/anecdoteReducer'

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

  const handleNew = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(createAnecdote(content))
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
      <form onSubmit={handleNew}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App