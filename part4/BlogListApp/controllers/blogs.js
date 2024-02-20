const jwt = require('jsonwebtoken')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')



/*
// Extracts auth toke from request header, now moved to middleware and accessible via request.token
const getToken = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
  }
  return null
}
*/

blogsRouter.get('/', async (request, response) => {
  
  const blogs = await Blog.find({}).populate('user')
  if (blogs) response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!request.body.title) 
    return response.status(400).json( { error: "title missing" } ) // 400 Bad Request
  else if (!request.body.url) 
    return response.status(400).json( { error: "url missing" } ) // 400 Bad Request
  else {

    if (!request.token) 
      return response.status(401).json( {error: 'no authorization, you must login first'} ) // 401 Unauthorized
    
    const token = request.token //|| getToken( request )

    let decodedToken = ""
    try {
      decodedToken = jwt.verify( token , process.env.SECRET) }
    catch (error) {
      return response.status(401).json( {error: 'invalid auth token'} ) // 401 Unauthorized
    }
    const user = await User.findById(decodedToken.id)
      
    //const user = await User.findOne({})

    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    
    const newBlog = await blog.save()
    if (newBlog) {
      user.blogs = user.blogs.concat(newBlog._id)
      await user.save()
      response.status(201).json(newBlog) 
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  
  // check for auth token
  if (!request.token) 
    return response.status(401).json( {error: 'no authorization, you must login first'} ) // 401 Unauthorized
  const token = request.token //|| getToken( request )

  // decode auth token
  let decodedToken = ""
  try {
    decodedToken = jwt.verify( token , process.env.SECRET) }
  catch (error) {
    return response.status(401).json( {error: 'invalid auth token'} ) // 401 Unauthorized
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if (decodedToken.id === blog.user.toString()) {
      
      
      const deletedBlog = await blog.deleteOne()
      //const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
      if (deletedBlog) return response.status(204).end()
      else return response.status(404).end()  // 404 Not Found, not sure what would cause us to end up here or what the status should be...
    }
    else return response.status(403).json( {error: 'you can only delete your own entries'} ) // 403 Forbidden
  }
  else return response.status(404).end() // 404 Not Found

})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.body.title) response.status(400).json( { error: "title missing" } )
  else if (!request.body.url) response.status(400).json( { error: "url missing" } )
  else {
    
    const body = request.body

    const blogData = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    // TO DO: write tests for this
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogData, {new: true})
    if (updatedBlog) response.status(204).json(updatedBlog)
    else response.status(404).end()
  }
})

module.exports = blogsRouter