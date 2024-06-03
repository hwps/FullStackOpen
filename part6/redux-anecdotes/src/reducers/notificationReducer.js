import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        set(state, action) {
            return action.payload
        },
        clear(state, action) {
            return null
        }
    }
})

export const setNotification = (content, timeout) => {
    return dispatch => {
        dispatch(notificationSlice.actions.set(content))
        setTimeout(() => dispatch(notificationSlice.actions.clear()), timeout)
    }
}

export default notificationSlice.reducer