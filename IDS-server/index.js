const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken')
require('dotenv').config( { path: 'variables.env'} )

const connectDb = require('./config/db')

// Conectar a la base de datos
connectDb()

// Servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers['authorization'] || ''
    if(token){
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA)
        return {
          user
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
})

// Arrancar el servidor
server.listen({ port : process.env.PORT || 4000 })
  .then( ({url}) => {
    console.log(`Servidor listo en ${url}`)
  })
