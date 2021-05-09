const { gql } = require('apollo-server')

// Schema
const typeDefs = gql`

  type User{
    id: ID
    name: String
    lastName: String
    email: String
    type: String
    creationDate: String
  }

  type Token{
    token: String
  }

  type Product{
    id: ID
    name: String
    description: String
    price: Float
    ingredients: String
    type: String
    creationDate: String
  }

  input UserInput{
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input authenticateInput{
    email: String!
    password: String!
  }

  input ProductInput{
    name: String!
    description: String!
    price: Float!
    ingredients: String!
    type: String!
  }

  type Query{
    # Usuarios
    getUser(token: String!): User

    # Productos
    getProducts: [Product]
    getProduct(id: ID!): Product
  }

  type Mutation{
    # Usuarios
    insertUser(input: UserInput!): User
    authenticateUser(input: authenticateInput!): Token

    # Productos
    insertProduct(input: ProductInput!): Product
    updateProduct(id:ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): String
  }

`

module.exports = typeDefs