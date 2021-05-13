const mongoose = require('mongoose')

const ReservationsSchema = mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  },
  idOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  dateReservation: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Reservation', ReservationsSchema)