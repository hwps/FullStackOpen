// Dummy data for tests

const Blog = require('../models/blog')
const User = require('../models/user')


const users = [
	{
		'_id': '65ce015448dcaecbf1f3785b',
		'username':'unique',
		'name':'Unique Name',
		'passwordHash':'$2b$12$pWtAUw6wwoU0dsGgqLaZ4e9ous/TMWKf6GwkxqcAO9FR4UqrJtTKG', // "test"
		'blogs':[],
	}
]

const blogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		user: '65ce015448dcaecbf1f3785b',
		likes: 7,
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		user: '000000000000000000000000',
		likes: 5,
	},
	{
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		user: '65ce015448dcaecbf1f3785b',
		likes: 12,
	},
	{
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		user: '65ce015448dcaecbf1f3785b',
		likes: 10,
	},
	{
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		user: '65ce015448dcaecbf1f3785b',
		likes: 0,
	},
	{
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		user: '65ce015448dcaecbf1f3785b',
		likes: 2,
	}
]

const blogCount = blogs.length
const userCount = users.length

const blogsInDB = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = { blogs, users, blogCount, userCount, blogsInDB, usersInDB }