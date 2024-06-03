import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const upvote = async (id) => {
    const url = baseUrl + "/" + id
    const response = await axios.get(url)
    const votes = response.data.votes + 1
    const updatedAnecdote = {...response.data, votes}
    return await axios.put(url, updatedAnecdote)
}

export default { getAll, createNew, upvote }