// tests for users API
// /api/users/

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const testdata = require('./test_data')
const User = require('../models/user')

const test_api = supertest(app)

beforeEach( async () => {
	await User.deleteMany({})
	await User.insertMany( testdata.users )
})


describe('POST requests to user api root endpoint (adding new user)', () => {

	test('POST request to root endpoint adds user', async () => {
		const newUser = {
			username: 'test',
			name: 'Test User',
			password: 'test'
		}

		await test_api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const endResult = await testdata.usersInDB()
		expect(endResult).toHaveLength(testdata.users.length + 1)

		//console.log(endResult)
		const usernames = endResult.map(user => user.username)
		expect(usernames).toContain('test')
	})

	test('attempting to POST new user with already existing username will return a 409 Conflict status', async () => {
		const newUser = {
			username: 'unique',
			name: 'Test User',
			password: 'test'
		}

		const response = await test_api
			.post('/api/users')
			.send(newUser)
			.expect(409)
			.expect('Content-Type', /application\/json/)

		// check response body
		expect(response.body.error).toContain('username already exists')

		// check for new DB entry
		const endResult = await testdata.usersInDB()
		expect(endResult).toHaveLength(testdata.users.length)

	})


	test('attempting to POST new user with missing username will return a 400 Bad Request status', async () => {
		const newUser = {
			name: 'Test User',
			password: 'test'
		}

		const response = await test_api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// check response body
		expect(response.body.error).toContain('you must provide a username')

		// check for new DB entry
		const endResult = await testdata.usersInDB()
		expect(endResult).toHaveLength(testdata.users.length)

		// check for username in DB
		const usernames = endResult.map(user => user.username)
		expect(usernames).not.toContain('test')
	})

	test('attempting to POST new user with missing password will return a 400 Bad Request status', async () => {
		const newUser = {
			username: 'test',
			name: 'Test User',
		}

		const response = await test_api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// check response body
		expect(response.body.error).toContain('you must provide a password of at least 3 characters')

		// check for new DB entry
		const endResult = await testdata.usersInDB()
		expect(endResult).toHaveLength(testdata.users.length)

		// check for username in DB
		const usernames = endResult.map(user => user.username)
		expect(usernames).not.toContain('test')
	})

	test('attempting to POST new user with password of less than three characters will return a 400 Bad Request status', async () => {
		const newUser = {
			username: 'test',
			name: 'Test User',
			password: 'te'
		}

		const response = await test_api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// check response body
		expect(response.body.error).toContain('you must provide a password of at least 3 characters')

		// check for new DB entry
		const endResult = await testdata.usersInDB()
		expect(endResult).toHaveLength(testdata.users.length)

		// check for username in DB
		const usernames = endResult.map(user => user.username)
		expect(usernames).not.toContain('test')
	})
})

afterAll( async () => {
	await mongoose.connection.close()
})