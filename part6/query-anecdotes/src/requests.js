import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = newAnecdote => axios.post(baseUrl, newAnecdote).then(res => res.data)
const update = updatedAnecdote => axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)

export default { getAll, create, update}