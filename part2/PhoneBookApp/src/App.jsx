import React, {useState, useEffect} from 'react';
import contactService from './services/contacts'

// sub-components

const Filter = ({value, onChange}) => {
  return (
  <form>
    <div>Filter: <input value={value} onChange={onChange} /></div>
  </form>
  )
}

const AddContactForm = ({name, number, onNameChange, onNumberChange, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
    <div>Name: <input value={name} onChange={onNameChange} /></div>
    <div>Number: <input value={number} onChange={onNumberChange} /></div>
    <div><button type="submit">Add</button></div>
  </form>
  )
}


const DisplayContacts = ({personsToShow, deleteButton}) => {
  return (personsToShow.map(person => 
  <div key={person.name}>
    {person.name} {person.number}
    <button onClick={() => deleteButton(person)}>Delete</button>
  </div>
  ))
}

const Notification = ({ message, type }) => {
  
  const styles = {
    error: {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10 },
    info: {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10 }
  }
  
  if (message === null) { return null }
  return (
    <div style={styles[type]}>
      {message}
    </div>
  )
}

// main component

const App = () => {
  const [contacts, setContacts] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('info') // valid types: info, error

  const [filter, setFilter] = useState('')

  useEffect(() => {
      contactService.getAll()
      .then(response => {
      setContacts(response.data)
    })
  }, [])

  const displayNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => setNotificationMessage(null), 5000) // hide notification after 5 sec
  }

  const removeContact = (contact) => {
    if (window.confirm(`Delete ${contact.name}?`))
    {
      contactService.remove(contact.id)
      .then(() => {
          setContacts(contacts.filter(c => c.id !== contact.id))
          displayNotification(`${contact.name} removed from phone book`, 'info')
        }
      )
    }
  }

  const addContact = (event) => {
    event.preventDefault()
    if (contacts.some(contact => contact.name === newName))
      {
        // Contact name already in phone book, ask if we want to update the number
        const changedContact = {...contacts.find(c => c.name ===newName), number: newNumber}
        if (window.confirm("Update number for " + changedContact.name))
        {
          contactService.update(changedContact.id, changedContact)
          .then(response => {
            setContacts(contacts.map(contact => contact.id !== changedContact.id ? contact : response.data))
            displayNotification(`Number updated for ${response.data.name}`, 'info')
          })
          .catch(error => displayNotification(`Name ${changedContact.name} not found`, 'error'))
        }
      }
    else {

      // Create new contact
      const newContact = {
        name: newName,
        number: newNumber,
      }

      contactService.create(newContact)
      .then(response => {
        setContacts(contacts.concat(response.data))
        displayNotification(`${response.data.name} added to phone book`, "info")
      })
      .catch( error => displayNotification(`${error.response.data.error}`, 'error') )
    }

    setNewName('')
    setNewNumber('')
  }

  const personsToShow = contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()))

  return(<div>
    <h2>Phone book</h2>
    <Notification message={notificationMessage} type={notificationType} />
    <Filter value={filter} onChange={(event) => setFilter(event.target.value)} />
    <h2>Add contact:</h2>
    <AddContactForm 
      name={newName} 
      number={newNumber} 
      onNameChange={(event) => setNewName(event.target.value)} 
      onNumberChange={(event) => setNewNumber(event.target.value)}
      onSubmit={addContact} />
    <h2>Contacts</h2>
    <DisplayContacts personsToShow={personsToShow} deleteButton={removeContact}/>
  </div>)
}

export default App;
