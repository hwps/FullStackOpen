import { useDispatch, useSelector } from "react-redux"
import { upvoteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    // fetch anecdotes from store matching filter
    const unsortedAnecdotes = useSelector(state => {
        if (!state.filter) 
            return state.anecdotes
        else {
            return state.anecdotes.filter(a => a.content.includes(state.filter))
        }
    })
    
    // sort according to likes

    const anecdotes = unsortedAnecdotes.toSorted((a, b) => {
        if (a.votes === b.votes) return 0
        else return a.votes > b.votes ? -1 : 1
    })

    const dispatch = useDispatch()

    const handleUpvote = (id) => {
        console.log('vote', id)
        dispatch(upvoteAnecdote(id))
        dispatch(setNotification('You upvoted ' + anecdotes.find(a => a.id === id).content))
        setTimeout(() => dispatch(clearNotification()), 5000)
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