const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config( { path: 'variables.env'} )

const User = require('./../models/Users')
const Product = require('./../models/Products')

const crearToken = (user, wordSecret, expiresIn) => {
  console.log(user)
  
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
    }
  },

  Mutation: {
    // Usuarios
    insertUser: async (_, { input }) => {

      const { email, password } = input

      // Revisar si el usuario ya esta registrado
      const userExists = await User.findOne({email: email})
      if(userExists){
        throw new Error('The user is already registered')
      }

      // Hashear passwords
      const salt = await bcryptjs.genSaltSync(10)
      input.password = await bcryptjs.hashSync(password, salt)

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
    }
  }
}

module.exports = resolvers