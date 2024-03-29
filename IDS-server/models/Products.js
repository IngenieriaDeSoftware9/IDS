const mongoose = require('mongoose')

const ProductsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  ingredients: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

ProductsSchema.index({ name: 'text' })

module.exports = mongoose.model('Product', ProductsSchema)