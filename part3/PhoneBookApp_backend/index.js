// Backend for Phonebook App

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Entry = require('./db_models/phonebookEntryModel')

const PORT = process.env.PORT

/// SETUP ///

let entries = []

const app = express()

app.use(express.json())
app.use(express.static('dist')) // frontend files go into ./dist

// logging
morgan.token('request_body', (req, res) => {
	return (Object.keys(req.body).length !== 0) ? JSON.stringify(req.body) : ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request_body'))

/// METHOD RESPONSES ///

// return title screen with link to info page
// this will not appear if frontend release is in ./dist
app.get('/', (request, response) => {
	response.send(
		`<h1>Phone Book backend</h1>
        <a href='info'>/info</a>`
	)
})

// return all phone book entries
app.get('/api/entries', ( request, response, next ) => {
	Entry.find({})
		.then( result => response.json(result) )
		.catch( error => next(error) )
})

// return single entry if found
app.get('/api/entries/:id', (request, response, next) => {

	Entry.findById(request.params.id)
		.then( result =>
		{
			if (result)
				response.json(result)
			else
				response.status(404).end() })
		.catch( error =>  next(error) )
})

// return info page
app.get('/info', ( request, response, next ) => {
	const currentDate = new Date().toString()
	Entry.find({})
		.then( result => {
			response.send(`
            <p>Phonebook has info for ${result.length} people</p>
            <p>${currentDate}</p>`)
		})
		.catch( error => next( error ) )
})

// delete entry
app.delete('/api/entries/:id', ( request, response, next ) => {
	Entry.findByIdAndDelete(request.params.id)
		.then( result => {
			if (result)
				response.status(204).end()
			else
				response.status(404).end()
		})
		.catch( error => next(error) )
})

// update entry
app.put('/api/entries/:id', ( request, response, next ) => {
	const body = request.body

	if (!body.number) {
		return response.status(400).json({ error: 'Number missing' })
	}

	Entry.findByIdAndUpdate(
		request.params.id,
		{ number: body.number },
		{ new: true, runValidators: true })
		.then( result => {
			const resultEntry = result.toJSON()
			response.status(200).send(resultEntry).end()
		})
})

// add entry
app.post('/api/entries', ( request, response, next ) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({ error: 'Name missing' })
	}
	else if (!body.number) {
		return response.status(400).json({ error: 'Number missing' })
	}


	Entry.find({ name: body.name })
		.then(result => {
			if (result.length)
			// Name already exists in db
				return response.status(409).json({ error: 'Name already exists in phone book, name must be unique' })
			else {
				// Create and post new entry to db
				const entry = new Entry({
					name: body.name,
					number: body.number,
				})

				entry.save()
					.then( result => {
						const resultEntry = result.toJSON()
						response.status(201).location('api/entries/' + resultEntry.id).send(resultEntry).end()
					})
					.catch( error => next( error ) )
			} })
		.catch( error => next( error ))

})

// EXTRA ROUTING

const unknownEndpoint = ( request, response ) => {
	response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = ( error, request, response, next ) => {
	console.log(error.message)
	if (error.name === 'CastError'){
		return response.status(400).send({ error: 'Malformatted id' })
	}
	else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: 'Name must be at least 3 characters long' })
	}

	next(error)
}
app.use(errorHandler)


/// SERVER INIT ///
app.listen(PORT, () =>  {
	console.log(`Phone Book server running on port ${PORT}`)
})
