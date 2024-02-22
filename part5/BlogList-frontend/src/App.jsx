import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  
  // fetch saved user credentials from localStorage on load
  useEffect( () => {
    const loginJSON = window.localStorage.getItem('BlogListAppLogin')
    if (loginJSON) {
      const user = JSON.parse(loginJSON)
      setUser(user)
      //noteService.setToken(user.token)
    }
  }, [])

  // get all blogs on load
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // user login form submit handler
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login( {username, password} )
      
      window.localStorage.setItem('BlogListAppLogin', JSON.stringify(user))
      //noteService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
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

  // login form component
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>Username:
        <input type="text" value={username} name="Username" onChange={({target}) => {
          setUsername(target.value) }} 
        />
      </div>

      <div>Password:
        <input type="password" value={password} name="Password" onChange={({target}) => {
          setPassword(target.value) }} 
        />
      </div>
      <button type="submit">Login</button>
    </form>
)

  // display login form if user not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  // else display blog list
  return (
    <div>
      <h2>Blogs</h2>
      <p>Logged in as {user.name} <button onClick={() => handleLogout()}>Log out</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App