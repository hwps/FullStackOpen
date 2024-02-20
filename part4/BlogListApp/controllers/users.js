const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs')
	res.json(users)
})

usersRouter.post('/', async (req, res) => {
	const body = req.body

	if (!body.username)
		return res.status(400).json( { error: 'you must provide a username' } ) // 400 Bad Request

	if (!body.password || body.password.length < 3)
		return res.status(400).json( { error: 'you must provide a password of at least 3 characters' } ) // 400 Bad Request

	if (await User.findOne( { username: body.username } )) {
		res.status(409).json( { error: 'username already exists' }) // 409 Conflict
	}
	else {
		const saltRounds = 12
		const passwordHash = await bcrypt.hash( body.password, saltRounds)

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash: passwordHash
		})

		const savedUser = await user.save()
		res.status(201).json(savedUser) // 201 Created

	}
})

module.exports = usersRouter