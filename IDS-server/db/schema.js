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
    type: TypeProduct
    creationDate: String
  }

  type Commentary{
    id: ID
    idUser: ID
    idProduct: ID
    description: String
    creationDate: String
  }

  type GroupOrder{
    id: ID
    amount: Int
  }

  type Order{
    id: ID
    order: [GroupOrder]
    total: Float
    idUser: ID
    status: StatusOrder
    creationDate: String
  }

  type Reservation{
    id: ID
    idUser: ID
    idOrder: ID
    dateReservation: String
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

  input OrderProductInput{
    id: ID!
    amount: Int
  }

  input OrderInput{
    order: [OrderProductInput]
    total: Float!
    status: StatusOrder
  }

  input ReservationInput{
    idOrer: ID
    dateReservation: String!
    description: String
  }

  enum TypeProduct{
    Drinks
    Desserts
    Tickets
    MainCourse
  }

  enum StatusOrder{
    Earring
    Completed
    Cancelled
  }

  type Query{
    # Usuarios
    getUser: User
    getUsers: [User]

    # Productos
    getProducts: [Product]
    getProduct(id: ID!): Product
    searchProduct(text: String!): [Product]

    # Comentarios
    getCommentarys: [Commentary]
    getCommentarysUser: [Commentary]
    getCommentarysProduct(id: ID!): [Commentary]
    getCommentary(id: ID!): Commentary

    # Pedidos
    getOrders: [Order]
    getOrderUser: [Order]
    getOrder(id: ID!): Order
    getOrderStatus(state: String!): [Order]

    # Reservaciones
    getReservations: [Reservation]
    getReservationsUser: [Reservation]
    getReservation(id: ID!): Reservation
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

    # Pedidos
    insertOrder(input: OrderInput!): Order
    updateOrder(id: ID!, input: OrderInput!): Order
    deleteOrder(id: ID!): String

    # Reservaciones
    insertReservation(input: ReservationInput!): Reservation
    updateReservation(id: ID!, input: ReservationInput!): Reservation
    deleteReservation(id: ID!): String
  }

`

module.exports = typeDefs
