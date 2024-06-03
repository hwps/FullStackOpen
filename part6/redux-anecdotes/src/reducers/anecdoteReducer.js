import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'
import { setNotification, clearNotification } from "./notificationReducer"

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      return [...state, action.payload]
    },
    upvoteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id )
      const upvotedAnecdote = { ...anecdote, votes: anecdote.votes + 1}
      return state.map(a => a.id === id ? upvotedAnecdote : a)

    },
    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { appendAnecdote, upvoteAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setNotification('You added ' + content))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }
}

export default anecdoteSlice.reducer