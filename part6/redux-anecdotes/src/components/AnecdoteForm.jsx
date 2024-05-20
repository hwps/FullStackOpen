import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleNew = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
    
        dispatch(createAnecdote(content))
    }

    return (      
        <form onSubmit={handleNew}>
            <div><input name="anecdote"/></div>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm