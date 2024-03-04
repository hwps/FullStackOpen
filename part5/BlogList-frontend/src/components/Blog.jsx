import PropTypes from 'prop-types'
import { useState } from "react"

const Blog = ({ blog, handleLike, handleDelete, showDeleteButton }) => {

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
          Likes: {blog.likes}&nbsp; <button onClick={() => handleLike(blog)}>Like</button>
        </div>
        <div>
          Added by: {blog.user.name}
        </div>
        <div style={{display: showDeleteButton ? '' : 'none'}}>
          <button onClick={() => handleDelete(blog)}>Delete</button>
        </div>
      </div> 
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool.isRequired
}

export default Blog