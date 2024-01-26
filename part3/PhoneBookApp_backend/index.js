require('dotenv').config()
const express = require("express")
const morgan = require("morgan")

const Entry = require('./db_models/phonebookEntryModel')

const PORT = process.env.PORT

/// SETUP ///

// init database

let entries = []

const app = express()

// logging
morgan.token('request_body', (req, res) => { 
    return (Object.keys(req.body).length !== 0) ? JSON.stringify(req.body) : " "
}) 

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request_body'))
app.use(express.json())
app.use(express.static('dist'))


/// REQUEST RESPONSES ///

// return title screen with link to info page
app.get("/", (request, response) => {
    response.send(
        `<h1>Phone Book backend</h1>
        <a href='info'>/info</a>`
    )
})

// return all phone book entries
app.get("/api/entries", (request, response) => {
    Entry.find({})
        .then( result => response.json(result) )
})

// return single entry if found
app.get("/api/entries/:id", (request, response) => {
    
    Entry.findById(request.params.id)
        .then( result => response.json(result) )
        .catch( () => response.status(404).end() )
})

// return info page
app.get("/info", (request, response) => {
    const currentDate = new Date().toString()
    response.send(`
        <p>Phonebook has info for ${entries.length} people</p>
        <p>${currentDate}</p>
    `)
})

// delete entry
app.delete("/api/entries/:id", (request, response) => {
    Entry.findByIdAndDelete(request.params.id)
        .then(  response.status(204).end() )
        .catch( response.status(404).end() )
})

// add entry
app.post("/api/entries", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: "Name missing"})
    }
    else if (!body.number) {
        return response.status(400).json({error: "Number missing"})
    }
    else if (entries.find(entry => entry.name === body.name)) {
        return response.status(409).json({error: "Name already exists in phone book, name must be unique"})
    }
    
    const entry = new Entry({
        name: body.name,
        number: body.number,
    })
    
    entry.save().then(result => {
        const resultEntry = result.toJSON()
        response.status(201).location("api/entries/" + resultEntry.id).send(resultEntry).end()
        
    })
})


/// SERVER INIT ///
app.listen(PORT, () =>  {
    console.log(`Phone Book server running on port ${PORT}`)
})
