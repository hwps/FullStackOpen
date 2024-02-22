import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  const [user, setUser] = useState(null)

  
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
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  // EVENT CALLBACKS

  // user login form submit handler
  const handleLogin = async (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)
    const form = {}
    for (const [key, val] of formData.entries()) form[key] = val
    
    try {
      const user = await loginService.login( {username: form.username, password: form.password} )
      
      window.localStorage.setItem('BlogListAppLogin', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log('wrong credentials')
      //setErrorMessage('wrong credentials')
      //setTimeout( () => {setErrorMessage(null)}, 5000 )
    }
  }
  
  // user logout button handler
  const handleLogout = async (event) => {
    window.localStorage.setItem('BlogListAppLogin', null)
    setUser(null)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const form = {}
    for (const [key, val] of formData.entries()) form[key] = val
    console.log(form)

    try {
      const addedBlog = await blogService.postNew( {title: form.title, author: form.author, url: form.url} )
      setBlogs(blogs.concat(addedBlog))
    } catch (exception) {
      console.log(exception)
    }


  }

  // COMPONENTS

  // login form component
  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>Username:
          <input type="text" name="username" onChange={({target}) => {
            /* setUsername(target.value)*/ }} 
            />
        </div>

        <div>Password:
          <input type="password" name="password" onChange={({target}) => {
            /* setPassword(target.value)*/ }} 
            />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )

  // add blog form component
  const addBlogForm = () => (
    <form onSubmit={handleAddBlog}>
      <div>Title: <input type="text" name="title"/></div>
      <div>Author: <input type="text" name="author"/></div>
      <div>URL: <input type="text" name="url"/></div>
      <button type="submit">Add Blog</button>
    </form>
  )

  // blog list component
  const blogList = () => (
    <div>
      <p>Logged in as {user.name} <button onClick={() => handleLogout()}>Log out</button></p>
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          <div>
            {addBlogForm()}
          </div>
    </div>
  )

  return (
    <div>
      <h1>Blog List</h1>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App