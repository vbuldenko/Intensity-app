const Client = require('./models/fs_client');
// let clients = require('./data');
const express = require('express');
const morgan = require('morgan');
const app = express();
// const cors = require('cors')

// app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/api/clients', (req, res, next) => {
  Client.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))
  
})

app.put('/api/clients/:id', (req, res, next) => {
    // const id = Number(request.params.id)
    // const person = contacts.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    //   } else {
    //     response.status(404).end()
    //   }
    const {name, number} = req.body

    const contact = {name, number}
  
    Contact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true, context: 'query' })
      .then(updtContact => {
        res.json(updtContact)
      })
      .catch(error => next(error))
})

app.get('/api/clients/:id', (req, res, next) => {
  // const id = Number(request.params.id)
  // const person = contacts.find(person => person.id === id)
  // if (person) {
  //     response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(400).end()
      }
    })
    .catch(error => next(error))
})

app.post ('/api/clients', (req, res, next) => {

    // if (contacts.find(contact => contact.name === req.body.name)) {
    //     return res.status(400).json({ 
    //       error: 'name must be unique' 
    //     })
    // }
    const {name, number} = req.body

    const contact = new Contact({name, number})

    contact.save().then(savedResult => {
      console.log(`added ${name} number ${number} to the phonebook`)
      res.json(savedResult)
    }).catch(error => next(error))
    // const newId = Math.floor(Math.random() * 1000) + 1
    // const person = req.body
    // person.id = newId
    // contacts = contacts.concat(person)
})

app.delete('/api/clients/:id', (req, res, next) => {
    // const id = Number(req.params.id)
    // contacts = contacts.filter(p => p.id !== id)
  
    // res.status(204).end()
    Contact.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})