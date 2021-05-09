const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken')

const connectDb = require('./config/db')

// Conectar a la base de datos
connectDb()

// Servidor 
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Arrancar el servidor
server.listen()
  .then( ({url}) => {
    console.log(`Servidor listo en ${url}`)
  })
