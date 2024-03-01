import { useState } from "react"

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : ''}
  const showWhenVisible = { display: visible ? '' : 'none'}
  const toggleVisibility = () => {
    setVisible(!visible)
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
      {blog.author}: {blog.title}&nbsp;
        <button onClick={() => toggleVisibility()}>{visible ? 'Hide' : 'Show'}</button>
      </div>
      <div style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a>
        <div>
          Likes: {blog.likes}&nbsp; <button>Like</button>
        </div>
        <div>
          Added by: {blog.user.name}
        </div>
      </div> 
    </div>
  )
}

export default Blog