// Command line MongoDB client for FullStackOpen MOOC assignment 3.12
//
// Run with
//      node mongo.js <mongodb-url>
// to fetch all entries, or
//      node mongo.js <mongodb-url> <name> <number>
// to add a new entry

const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5)
{
	console.log('[mongo.js] error: Incorrect number or arguments')
	console.log('[mongo.js] Give arguments of the form node mongo.js <mongodb-url> <name> <number> to add a new entry to database')
	console.log('[mongo.js] Give arguments of the form node mongo.js <mongodb-url> to return all entries from database')
	process.exit()
}

const url = process.argv[2]

mongoose.set('strictQuery', false)
mongoose.connect(url)

// schema
const entrySchema = new mongoose.Schema(
	{
		name: String,
		number: String
	}
)

// model
const Entry = mongoose.model('Entry', entrySchema)

// add new entry to DB
if (process.argv.length === 5)
{
	const entry = new Entry({
		name: process.argv[3],
		number: process.argv[4]
	})

	entry.save().then(result => {
		console.log(`Added ${entry.name} number ${entry.number} to phonebook`)
		mongoose.connection.close()
	})
}

// get all entries from DB
if (process.argv.length === 3)
{
	Entry.find({}).then(result => {
		console.log('phonebook:')
		result.forEach(entry => {
			console.log(entry)
		})
		mongoose.connection.close()
	})
}
