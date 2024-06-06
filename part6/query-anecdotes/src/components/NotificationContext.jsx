import { useReducer, createContext, useContext } from "react";

var notificationText
var notificationDispatch

const clearNotification = () => 
    {
        console.log("hiding notification")
        notificationDispatch({type: "CLEAR"})
    }

const notificationReducer = (state, action) => {
    switch (action.type) {
      case "SHOW":
        console.log(action.payload.text)
        setTimeout(clearNotification, action.payload.timeout)
        return action.payload.text
      case "CLEAR":
        return null
      default:
        return null
    }
  }

const NotificationContext = createContext()

export const useNotificationText = () => {
    return useContext(NotificationContext)[0]
}

export const useNotificationDispatch = () => {
    return useContext(NotificationContext)[1]
}

export const NotificationContextProvider = (props) => {
    [notificationText, notificationDispatch] = useReducer(notificationReducer, 0)
    return <NotificationContext.Provider value={[notificationText, notificationDispatch]}>
        {props.children}
    </NotificationContext.Provider>
}

export default NotificationContext