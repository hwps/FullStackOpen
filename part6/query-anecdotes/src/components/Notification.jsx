import { useNotificationText } from "./NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const notificationText = useNotificationText()
  if (!notificationText) return null

  return (
    <div style={style}>
      {notificationText}
    </div>
  )
}

export default Notification
