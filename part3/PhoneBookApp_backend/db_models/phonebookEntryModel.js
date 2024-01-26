const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB at ', url, ' ...')
mongoose.connect(url)
    .then( result => {
        console.log('Connected to MongoDB')
    })
    .catch( error => {
        console.log('Error connecting to MongoDB: ', error.message)
    })


// db schema
const entrySchema = new mongoose.Schema(
    {
        name: String,
        number: String
    }
)

entrySchema.set('toJSON', {
    transform: ( document, returnedObject ) =>
        {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
})

// export model
module.exports = mongoose.model('Entry', entrySchema)