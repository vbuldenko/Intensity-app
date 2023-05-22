const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const clientSchema = new mongoose.Schema({
  first_name: {
    type: String,
    minLength: 3,
    required: true
  },
  last_name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,}/.test(v);
      },
      message: 'Invalid phone number format. Please use XX-XXXXX or XXX-XXXXX instead.'
    },
    minLength: 8,
    required: true
  }
})

clientSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Client', clientSchema)