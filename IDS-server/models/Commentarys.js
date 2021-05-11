const mongoose = require('mongoose')

const ProductsSchema = mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  },
  idProduct: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'Product'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Commentary', ProductsSchema)