import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'
import { setNotification, clearNotification } from "./notificationReducer"

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    add(state, action) {
      return [...state, action.payload]
    },
    upvote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id )
      const upvotedAnecdote = { ...anecdote, votes: anecdote.votes + 1}
      return state.map(a => a.id === id ? upvotedAnecdote : a)

    },
    setAll(state, action) {
      return action.payload
    },
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(anecdoteSlice.actions.setAll(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(anecdoteSlice.actions.add(newAnecdote))
    dispatch(setNotification('You added ' + content))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }
}

export const upvoteAnecdote = id => {
  return async dispatch => {
    anecdoteService.upvote(id)
    dispatch(anecdoteSlice.actions.upvote(id))
  }
}

export default anecdoteSlice.reducer