const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

usersRouter.post('/', async (req, res) => {    
    const body = req.body

    if (await User.findOne( {username: body.username} )) {
        res.status(400).json( {error: 'username already exists'})
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
        res.status(201).json(savedUser)
        
    }
})

module.exports = usersRouter