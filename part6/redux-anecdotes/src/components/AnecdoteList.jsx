import { useDispatch, useSelector } from "react-redux"
import { upvoteAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
    // fetch anecdotes from store and sort according to likes
    const anecdotes = useSelector(state => state)
    anecdotes.sort((a, b) => {
        if (a.votes === b.votes) return 0
        else return a.votes > b.votes ? -1 : 1
    })
    const dispatch = useDispatch()

    const handleUpvote = (id) => {
        console.log('vote', id)
        dispatch(upvoteAnecdote(id))
    }
        
    return (      
        <div>
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
        </div>
    )
}

export default AnecdoteList