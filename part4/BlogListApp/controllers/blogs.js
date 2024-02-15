const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  
  const blogs = await Blog.find({}).populate('user')
  if (blogs) response.json(blogs)
  /*
  Blog
  .find({})
  .then(blogs => {
    response.json(blogs)
  })
  */
})

blogsRouter.post('/', async (request, response) => {

  if (!request.body.title) response.status(400).json( { error: "title missing" } )
  else if (!request.body.url) response.status(400).json( { error: "url missing" } )
  else {

    const user = await User.findOne({})

    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    //if (!request.body.likes) request.body['likes'] = 0
    
    const newBlog = await blog.save()
    if (newBlog) {
      user.blogs = user.blogs.concat(newBlog._id)
      await user.save()
      response.status(201).json(newBlog) 
    }
    //new Blog(request.body) // TO DO: fill out the actual fields instead of just copypasting the request body, see PUT request
    
    //blog.save().then(result => response.status(201).json(result))
    
    /* 
    blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    */
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (deletedBlog) response.status(204).end()
  else response.status(404).end()

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