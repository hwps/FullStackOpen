import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Togglable from './components/Togglable'
import AddBlogForm from './components/AddBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {

  const styles = {
    error: {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10 },
    info: {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10 }
  }

  if (message === null) { return null }
  return (
    <div style={styles[type]}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('info') // valid types: info, error

  const blogFormRef = useRef()

  const blogSortFunc = (a, b) => {
    // Pass to Array.sort() to sort blogs according to likes
    if (a.likes === b.likes) return 0
    else return a.likes > b.likes ? -1 : 1
  }

  // REACT EFFECTS

  // fetch saved user credentials from localStorage on load
  useEffect( () => {
    const loginJSON = window.localStorage.getItem('BlogListAppLogin')
    if (loginJSON) {
      const user = JSON.parse(loginJSON)
      setUser(user)
      if (user) blogService.setToken(user.token)
    }
  }, [])

  // get all blogs on load
  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(blogSortFunc)
      setBlogs( blogs ) }
    )
  }, [])

  // NOTIFICATION COMPONENT SETTER

  // valid types: info, error
  const displayNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => setNotificationMessage(null), 5000) // hide notification after 5 sec
  }


  // EVENT CALLBACKS

  // user login form submit handler
  const handleLogin = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const form = {}
    for (const [key, val] of formData.entries()) form[key] = val

    try {
      const user = await loginService.login( { username: form.username, password: form.password } )

      window.localStorage.setItem('BlogListAppLogin', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      //console.log(exception)
      displayNotification('Incorrect username or password', 'error')
    }
  }

  // user logout button handler
  const handleLogout = async (event) => {
    window.localStorage.setItem('BlogListAppLogin', null)
    setUser(null)
  }

  // new blog form handler
  const handleBlogListEntry = async (newBlogData) => {
    try {
      const addedBlog = await blogService.postNew( newBlogData )

      addedBlog.user = { name: user.name }
      setBlogs(blogs.concat(addedBlog))
      displayNotification(`Added ${addedBlog.title} to blog list`, 'info')
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log(exception)
      displayNotification('Error adding blog', 'error')
    }
  }

  // like button handler
  const handleLike = async (blogData) => {
    const updatedBlog = await blogService.addLike(blogData)
    const newBlogList = blogs.map(blog => blog.id === updatedBlog.id ? { ...blog, likes: updatedBlog.likes } : blog)
    newBlogList.sort(blogSortFunc)
    setBlogs(newBlogList)
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      const newBlogList = blogs.filter(b => b.id !== blog.id)
      setBlogs(newBlogList)
      displayNotification(`Deleted blog ${blog.title}`, 'info')
    } catch (error) {
      displayNotification(`Error deleting blog ${blog.title}`, 'error')
      console.log(error)
    }
  }

  // SUB-COMPONENTS

  // login form component
  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>Username:
          <input type="text" name="username" onChange={({ target }) => {
            /* setUsername(target.value)*/ }}
          />
        </div>

        <div>Password:
          <input type="password" name="password" onChange={({ target }) => {
            /* setPassword(target.value)*/ }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )

  // blog list component
  const blogList = () => (
    <div>
      <p>Logged in as {user.name} <button onClick={() => handleLogout()}>Log out</button></p>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          showDeleteButton={user.username === blog.user.username ? true : false}
          handleDelete={handleDelete}
        />
      )}
      <div>
        <Togglable buttonLabel="Add new blog"  ref={blogFormRef}>
          <AddBlogForm addBlogListEntry={handleBlogListEntry}/>
        </Togglable>
      </div>
    </div>
  )

  // RETURN MAIN COMPONENT

  return (
    <div>
      <h1>Blog List</h1>
      <Notification message={notificationMessage} type={notificationType} />
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App