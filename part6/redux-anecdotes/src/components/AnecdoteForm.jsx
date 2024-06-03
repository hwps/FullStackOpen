import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleNew = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
         
        dispatch(createAnecdote(content))
        dispatch(setNotification('You added ' + content, 5000))
    }

    return (     
        <div>
        <h2>create new</h2> 
        <form onSubmit={handleNew}>
            <div><input name="anecdote"/></div>
            <button type="submit">create</button>
        </form>
        </div>
    )
}

export default AnecdoteForm