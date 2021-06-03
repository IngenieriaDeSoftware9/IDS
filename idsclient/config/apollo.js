// ApolloClient para crear el cliente de apollo e interactuar con el servidor
// createHtpLink para crear la ruta donde se haran las consultas
// InMemoryCache para crear y manejar el cache de la aplicacion
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

// Se crea la ruta donde se hacen las consultas
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch
})

// Agregar el token via headers
const authLink = setContext((_, { headers }) => {

  // Leer el storage almacenado
  const token = localStorage.getItem('token')
  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// Se crea el cliente de apollo
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat( httpLink )
})

export default client