const mongoose = require('mongoose')

const OrdersSchema = mongoose.Schema({
  order: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  },
  status: {
    type: String,
    default: 'Earring'
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Order', OrdersSchema)