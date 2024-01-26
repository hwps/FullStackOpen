import axios from 'axios'
const serverUrl = 'api/entries'

const getAll = () => {
    return axios.get(serverUrl)
}

const create = (newObject) => {
    return axios.post(serverUrl, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${serverUrl}/${id}`, newObject)
}

const remove = (id) => {
    return axios.delete(`${serverUrl}/${id}`)
}

const exports = { getAll, create, update, remove }

export default exports