import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, showDeleteButton }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
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
    <div style={blogStyle} className='blogInfo'>
      <div className='blogInfoBasic'>
        {blog.author}: {blog.title}&nbsp;
        <button id="show-blogInfoExtended" onClick={() => toggleVisibility()}>{visible ? 'Hide' : 'Show'}</button>
      </div>
      <div className='blogInfoExtended' style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a>
        <div id="blogLikes">
          Likes: {blog.likes}&nbsp; <button id="blogLikeButton" onClick={() => handleLike(blog)}>Like</button>
        </div>
        <div>
          Added by: {blog.user.name}
        </div>
        <div style={{ display: showDeleteButton ? '' : 'none' }}>
          <button id="blogDeleteButton" onClick={() => handleDelete(blog)}>Delete</button>
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