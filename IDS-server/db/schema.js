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

  type Commentary{
    id: ID
    idUser: ID
    idProduct: ID
    description: String
    creationDate: String
  }

  input UserInput{
    name: String!
    lastName: String!
    email: String!
    password: String!
    type: String
  }

  input authenticateInput{
    email: String!
    password: String!
  }

  enum TypeProduct{
    Drinks
    Desserts
    Tickets
    MainCourse
  }

  input ProductInput{
    name: String!
    description: String!
    price: Float!
    ingredients: String!
    type: TypeProduct!
  }

  input CommentaryInput{
    idProduct: ID!
    description: String!
  }

  type Query{
    # Usuarios
    getUser(token: String!): User
    getUsers: [User]

    # Productos
    getProducts: [Product]
    getProduct(id: ID!): Product

    # Comentarios
    getCommentarys: [Commentary]
    getCommentarysUser: [Commentary]
    getCommentarysProduct(id: ID!): [Commentary]
  }

  type Mutation{
    # Usuarios
    insertUser(input: UserInput!): User
    authenticateUser(input: authenticateInput!): Token
    updateUser(id: ID, input: UserInput!): User
    deleteUser(id: ID): String

    # Productos
    insertProduct(input: ProductInput!): Product
    updateProduct(id:ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): String

    # Comentarios
    insertCommentary(input: CommentaryInput!): Commentary
    updateCommentary(id: ID!, input: CommentaryInput!): Commentary
    deleteCommentary(id: ID!): String
  }

`

module.exports = typeDefs