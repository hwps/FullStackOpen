import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postNew = async (newObject) => {
  const config = {
    headers: {Authorization: token},
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addLike = async (blogObject) => {
  const config = {
    headers: {Authorization: token},
  }

  const likedBlog = {
    title: blogObject.title,
    author: blogObject.author,
    url: blogObject.url,
    likes: blogObject.likes + 1,
    user: blogObject.user.id
  }
  const response = await axios.put(`${baseUrl}/${blogObject.id}`, likedBlog, config)
  return response.data
}

export default { getAll, postNew, setToken, addLike }