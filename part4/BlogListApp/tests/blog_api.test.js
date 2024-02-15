const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const testdata = require('./test_data')
const Blog = require('../models/blog')

const test_api = supertest(app)


beforeEach( async () => {
    await Blog.deleteMany({})
    await Blog.insertMany( testdata.blogs )
})

// GET tests

describe('GET request to blog api root endpoint (getting data for all blogs)', () => {

    test('blog data is returned as json', async () => {
        await test_api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await test_api.get('/api/blogs')
        
        expect(response.body).toHaveLength( testdata.blogCount )
    })

    test('id field is named "id" (MongoDB default is _id)', async () => {
        const response = await test_api.get('/api/blogs')

        response.body.forEach(blogData => {
            expect(blogData.id).toBeDefined()
            expect(blogData._id).not.toBeDefined() })

    })
})

// POST tests

describe('POST requests to blog api root endpoint (adding new blogs to list)', () => {

    test('POST request to root endpoint adds blog', async () => {
        const newBlog = {
            title: "Test title",
            author: "Test Author",
            url: "https://localhost/",
            likes: 0,
        }
        
        await test_api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const endResult = await testdata.blogsInDB()
        expect(endResult).toHaveLength(testdata.blogs.length + 1)

        //console.log(endResult)
        const titles = endResult.map(blog => blog.title)
        expect(titles).toContain('Test title')
    })

    test('attempting to POST new blog with missing title will return a 400 Bad Request status', async () => {
        const newBlog = {
            author: "Test Author",
            url: "https://localhost/",
        }
        
        const returnedBlog = await test_api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('attempting to POST new blog with missing url will return a 400 Bad Request status', async () => {
        const newBlog = {
            title: "Test title",
            author: "Test Author",
        }
        
        const returnedBlog = await test_api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('new blog with undefined number of likes will get an initial like count of zero', async () => {
        const newBlog = {
            title: "Test title",
            author: "Test Author",
            url: "https://localhost/",
        }
        
        const returnedBlog = await test_api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        expect(returnedBlog.body.likes).toEqual(0)
    })
})

// DELETE tests

describe('DELETE requests (deleting blogs from list)', () => {
    test('DELETE request to "/<id>" deletes blog from list', async () => {
        const initialBlogs = await testdata.blogsInDB()
        const id = initialBlogs[0].id

        const deletedBlog = await test_api
            .delete(`/api/blogs/${id}`)
            .send()
            .expect(204)

        const endResult = await testdata.blogsInDB()
        expect(endResult).toHaveLength(testdata.blogCount - 1)
        expect(endResult).not.toContain(initialBlogs[0].title)
    })

    test('DELETE request to non-existent id returns 404 Not Found', async () => {
        const id = '000000000000000000abad1d'

        test_api
            .delete(`/api/blogs/${id}`)
            .send()
            .expect(404)
    })
})

describe('PUT requests (editing blogs in list', () => {
    test('PUT request to "/<id> updates blog in list', async () => {

        const initialData = await testdata.blogsInDB()
        const id = initialData[0].id

        const updatedData = {
            title: initialData[0].title,
            author: "Test Author",
            url: initialData[0].url,
            likes: initialData[0].likes
        }

        await test_api
            .put(`/api/blogs/${id}`)
            .send(updatedData)
            .expect(204)

        
        const endResult = await testdata.blogsInDB()
        expect(endResult).toHaveLength(testdata.blogCount)
        expect(endResult[0].author).toContain(updatedData.author)
    })


    test('PUT request to nonexisting id returns 404 Not Found', async () => {

        const initialData = await testdata.blogsInDB()
        const id = '000000000000000000abad1d'

        const updatedData = {
            title: initialData[0].title,
            author: "Test Author",
            url: initialData[0].url,
            likes: initialData[0].likes
        }

        await test_api
            .put(`/api/blogs/${id}`)
            .send(updatedData)
            .expect(404)

        
        const endResult = await testdata.blogsInDB()
        expect(endResult).toHaveLength(testdata.blogCount)
    })
})

afterAll( async () => {
    await mongoose.connection.close()
})