const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config( { path: 'variables.env'} )

const User = require('./../models/Users')
const Product = require('./../models/Products')
const Commentary = require('./../models/Commentarys')
const Order = require('./../models/Orders')
const Reservation = require('./../models/Reservations')

const crearToken = (user, wordSecret, expiresIn) => {
  
  const { id, email, name, lastName } = user

  return jwt.sign({ id, email, name, lastName}, wordSecret, { expiresIn })
}

// Resolver
const resolvers = {
  Query: {
    // Usuarios
    getUser: async (_, { token }) => {
      const UserId = await jwt.verify(token, process.env.SECRETA)

      return UserId
    },
    getUsers: async () => {
      try {
        const users = await User.find({})
        return users
      } catch (error) {
        console.log(error)
      }
    },

    // Productos
    getProducts: async () => {
      try {
        const products = await Product.find({})
        return products
      } catch (error) {
        console.log(error)
      } 
    },
    getProduct: async (_, { id }) => {
      try {
        // Revisar si el producto existe 
        const product = await Product.findById(id)
        if(!product){
          throw new Error('Product not found')
        }
        return product
      } catch (error) {
        console.log(error);
      }
    },
    searchProduct: async (_, { text }) => {
      const products = await Product.find({ $text : {
        $search: text
      }})
        .limit(10)
      return products
    },

    // Comentarios
    getCommentarys: async () => {
      try {
        const commentarys = await Commentary.find({})
        return commentarys
      } catch (error) {
        console.log(error);
      }
    },
    getCommentarysUser: async (_, {}, ctx) => {
      try {
        const commentarys = await Commentary.find({ idUser : ctx.user.id.toString() })
        return commentarys
      } catch (error) {
        console.log(error);
      }
    },
    getCommentarysProduct: async (_, { id }) => {
      try {
        const commentarys = await Commentary.find({ idProduct : id })
        if(!commentarys){
          throw new Error('Commentary not found')
        }
        return commentarys
      } catch (error) {
        console.log(error);
      }
    },

    // Pedidos
    getOrders: async () => {
      try {
        const orders = await Order.find({})
        return orders
      } catch (error) {
        console.log(error);
      }
    },
    getOrderUser: async (_, {  }, ctx) => {
      try {
        const orders = await Order.find({ idUser: ctx.user.id })
        return orders
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      try {
        const order = await Order.findById(id)
        if(!order){
          throw new Error('Order not found')
        }

        if(order.idUser.toString() !== ctx.user.id){
          throw new Error('Action not allowed')
        }

        return order
      } catch (error) {
        console.log(error);
      }
    },
    getOrderStatus: async (_, { state }, ctx) => {
      try {
        const orders = await Order.find({ idUser: ctx.user.id, status: state })
        return orders
      } catch (error) {
        console.log(error);
      }
    },

    // Reservaciones
    getReservations: async () => {
      try {
        const reservations = await Reservation.find({})
        return reservations
      } catch (error) {
        console.log(error);
      }
    },
    getReservationsUser: async (_, {}, ctx) => {
      try {
        const reservations = await Reservation.find({ idUser: ctx.user.id})
        return reservations
      } catch (error) {
        console.log(error);
      }
    },
    getReservation: async (_, { id }, ctx) => {
      try {
        const reservation = await Reservation.findById(id)
        if(!reservation){
          throw new Error('Order not found')
        }

        if(reservation.idUser.toString() !== ctx.user.id){
          throw new Error('Action not allowed')
        }

        return order
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    // Usuarios
    insertUser: async (_, { input }) => {

      const { email, password, type } = input

      // Revisar si el usuario ya esta registrado
      const userExists = await User.findOne({email: email})
      if(userExists){
        throw new Error('The user is already registered')
      }

      // Hashear passwords
      const salt = await bcryptjs.genSaltSync(10)
      input.password = await bcryptjs.hashSync(password, salt)

      // Asignarle el tipo de usuario
      if(!type){
        input.type = 'Common'
      }

      try {
        // Guardar en la base de datos
        const user = new User(input)
        user.save()
        return user
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input

      // Si el usuario existe
      const userExists = await User.findOne({ email })
      if(!userExists){
        throw new Error('Username does not exist')
      }

      // Revisar si el password es correcto
      const correctPassword = await bcryptjs.compare(password, userExists.password)
      if(!correctPassword){
        throw new Error('The password is incorrect')
      }

      // Creat token
      return{
        token: crearToken(userExists, process.env.SECRETA, '24h')
      }
    },
    updateUser: async (_, { id, input }, ctx) => {
      try {
        if(!id){
          id = ctx.user.id
        }
        const emailEqual = await User.findById(id)
        const { email, password } = input
        if (email !== emailEqual.email) {
          const userExists = await User.findOne({email: email})
          if(userExists){
            throw new Error('The user is already registered')
          }
        }

        const salt = await bcryptjs.genSaltSync(10)
        input.password = await bcryptjs.hashSync(password, salt)

        const user = await User.findOneAndUpdate({ _id : id}, input, { new : true})
        return user
      } catch (error) {
        console.log(error);
      }
    },
    deleteUser: async (_, { id }, ctx) => {
      try {
        if(!id){
          id = ctx.user.id
        }
        const user = await User.findById(id)
        if(!user){
          throw new Error('User not found')
        }

        await User.findOneAndDelete({_id: id})
        return "User Delete"
      } catch (error) {
        console.log(error);
      }
    },

    // Productos
    insertProduct: async (_, { input }) => {
      const { name } = input

      // Revisar si el producto ya existe
      const productExists = await Product.findOne({ name })
      if(productExists){
        throw new Error('The product is already registered')
      }

      try {
        const product = new Product(input)

        // Almacenar en la base de datos
        const result = await product.save()
        return result
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, {id, input}) => {
      try {
        // Revisar si el producto existe 
        let product = await Product.findById(id)
        if(!product){
          throw new Error('Product not found')
        }
        
        // Guardar en la base de datos
        product = await Product.findOneAndUpdate({ _id : id }, input, { new: true })
        return product
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        // Revisar si el producto existe 
        const product = await Product.findById(id)
        if(!product){
          throw new Error('Product not found')
        }
        
        // Eliminar
        await Product.findOneAndDelete({_id: id})
        return "Product Delete"
      } catch (error) {
        console.log(error);
      }
    },

    // Comentarios
    insertCommentary: async (_, { input }, ctx) => {
      try {
        const newCommentary = new Commentary(input)
        
        // Asignar usuario
        newCommentary.idUser = ctx.user.id

        const result = await newCommentary.save()
        return result
      } catch (error) {
        console.log(error);
      }
    },
    updateCommentary: async (_, { id, input }, ctx) => {
      try {
        // Si es admin, puede borrar cualquier comentarios
        const user = await User.findById(ctx.user.id)
        let commentary = await Commentary.findById(id)
        if(user.type === 'Admin' || commentary.idUser.toString() === ctx.user.id){
          commentary = await Commentary.findOneAndUpdate({ _id: id }, input, { new : true})
          return commentary
        }else{
          throw new Error('It is not possible to update a comment that is not yours')
        }     
      } catch (error) {
        console.log(error);
      }
    },
    deleteCommentary: async (_, { id }, ctx) => {
      try {
        // Si es admin, puede borrar cualquier comentarios
        const user = await User.findById(ctx.user.id)
        let commentary = await Commentary.findById(id)
        if(user.type === 'Admin' || commentary.idUser.toString() === ctx.user.id){
          commentary = await Commentary.findOneAndDelete({ _id : id})
          return "Commentary delete"
        }else{
          throw new Error('It is not possible to delete a comment that is not yours')
        } 
      } catch (error) {
        console.log(error);
      }
    },

    // Pedidos
    insertOrder: async (_, { input }, ctx) => {
      try {
        const newOrder = new Order(input)
        newOrder.idUser = ctx.user.id
        const result = await newOrder.save()
        return result
      } catch (error) {
        console.log(error);
      }
    },
    updateOrder: async (_, { id, input }, ctx) => {
      try {

        // Verificar si el pedido existe
        const orderExists = await Order.findById(id)
        if(!orderExists){
          throw new Error('The order does not exist')
        }
        // Mirar si el pedido es del usuario
        if(orderExists.idUser.toString() !== ctx.user.id) {
          throw new Error('Action not allowed')
        }

        // Actualizar
        const result = await Order.findByIdAndUpdate({_id: id}, input, { new: true })
        return result
      } catch (error) {
        console.log(error);
      }
    },
    deleteOrder: async (_, { id }, ctx) => {
      try {
        // Revisar si la orden existe
        const orderExists = await Order.findById(id)
        if(!orderExists){
          throw new Error('Order does not exist')
        }
        const user = await User.findById(ctx.user.id)

        if(orderExists.idUser.toString() === ctx.user.id || user.type.toString() === 'Admin'){
          // Eliminar de la base de datos
          await Order.findOneAndDelete({_id: id})
          return "Delete Order"
        }
        throw new Error('Action not allowed')
      } catch (error) {
        console.log(error);
      }
    },

    // Reservaciones
    insertReservation: async (_, { input }, ctx) => {
      try {
        const newReservation = new Reservation(input)
        newReservation.idUser = ctx.user.id
        const result = await newReservation.save()
        return result
      } catch (error) {
        console.log(error);
      }
    },
    updateReservation: async (_, { id, input }, ctx) => {
      try {
        // Verificar si la reservacion existe 
        const reservationExists = await Reservation.findById(id)
        if(!reservationExists){
          throw new Error('The reservation does not exist')
        }

        // Mirar si la reservacion es del usuario 
        if(reservationExists.idUser.toString() !== ctx.user.id) {
          throw new Error('Action not allowed')
        }

        // Actualizar reservacion
        const result = await Reservation.findByIdAndUpdate({_id: id}, input, { new: true })
        return result
      } catch (error) {
        console.log(error);
      }
    },
    deleteReservation: async (_, { id }, ctx) => {
      try {
        // Verificar si la reservacion existe 
        const reservationExists = await Reservation.findById(id)
        if(!reservationExists){
          throw new Error('The reservation does not exist')
        }

        // Borrar reservacion
        const user = await User.findById(ctx.user.id)
        if(reservationExists.idUser.toString() === ctx.user.id || user.type.toString() === 'Admin'){
          // Eliminar de la base de datos
          await Reservation.findOneAndDelete({_id: id})
          return "Delete Order"
        }
        throw new Error('Action not allowed')
      } catch (error) {
        console.log(error);
      }
    }
  }
}

module.exports = resolvers