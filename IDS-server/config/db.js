const mongoose = require('mongoose')
require('dotenv').config( { path: 'variables.env'} )

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    })
    console.log('Db connected')
  } catch (err) {
    console.log('There was a mistake')
    console.log(err)
    process.exit(1) // Detiene la aplicación
  }
}

module.exports = connectDb