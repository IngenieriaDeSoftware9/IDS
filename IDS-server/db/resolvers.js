const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config( { path: 'variables.env'} )

const User = require('./../models/Users')
const Product = require('./../models/Products')
const Commentary = require('./../models/Commentarys')

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
    }
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
    }

  }
}

module.exports = resolvers