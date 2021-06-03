import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'  
import { useMutation, gql } from '@apollo/client'

// Mutation para agregar nuevos usuarios
const NUEVA_CUENTA = gql`
  mutation insertUser($input: UserInput!){
    insertUser(input: $input){
      id
      name	
      lastName
      email
      type
      creationDate
    }
  }
`

export default function NuevaCuenta() {

  // State para alerta de creacion de usuario
  const [mensaje, setMensaje] = useState(null)

  // Creacion del nuevo usuario
  const [insertUser] = useMutation(NUEVA_CUENTA)

  // Routing, para navegacion
  const router = useRouter()

  // Validacion del formulario
  const formik = useFormik({

    // Valores iniciales del formulario
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
    },

    // Tipo de validacion de cada campo
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string().email('El email no es valido')
                .required('El email es obligatorio'),
      password: Yup.string().required('El password es obligatorio')
                .min(6, 'El password debe tener 6 caracteres')
    }),

    // Funcion a ejecutar cuando se validan los campos
    onSubmit: async valores => {
      // Se obtienen los campos que se pasan al enviar el formulario
      const { nombre, apellido, email, password } = valores

      // Se prueba si hay error en el envio o si todo funciona
      try {

        // Se almacena lo que retorna la consulta del mutation
        const { data } = await insertUser({

          // Se le pasan las variables para insertar el usuario
          variables : {
            input:{
              name: nombre,
              lastName: apellido,
              email,
              password
            }
          }
        })

        // Usuario creado correctamente
        setMensaje(`Se creo correctamente el usuario ${data.insertUser.name}`)
        setTimeout(() => {

          // Redirigir usuario para iniciar sesion
          router.push('/login')
        }, 3000)
      } catch (error) {

        // Error al crear nuevo usuario
        setMensaje(error.message)
        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    }
  })

  // Funcion para mostrar mensaje al crear nuevo usuario
  const mostarMensaje = () => {
    return(
      <div className="bg-white p-3 w-full my-3 max-w-sm text-center mx-auto rounded">
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <div>
      <Layout>

        {/* Espacio para mostrar mensaje al crear usuario */}
        { mensaje  && mostarMensaje() }

        <h1 className="text-white text-2xl font-light text-center">Nueva Cuenta</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={ formik.handleSubmit } // Lo que pasa cuando se envia el formulario
            >

              {/* Bloque para llenar un dato del formulario */}
              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='nombre' // Para identificar el input
                type='nombre' // El tipo del input
                placeholder='Nombre Usuario' // Lo que dice el input
                autoComplete='off' // Para no mostrar opciones en el input
                value={formik.values.nombre} // Valor inicial del input
                onChange={formik.handleChange} // Para cambiar el valor del input
                onBlur={formik.handleBlur} // Para validar cuando se presiona fuera del input
                />
              </div>

              {/* Muestra si el input tiene algun espacio mal rellenado */}
              { formik.touched.nombre && formik.errors.nombre ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{formik.errors.nombre}</p>
                </div>
              ): null }

              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='apellido'
                type='apellido'
                placeholder='Apellido Usuario'
                autoComplete='off'
                value={formik.values.apellido}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.apellido && formik.errors.apellido ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{formik.errors.apellido}</p>
                </div>
              ): null }

              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='email'
                type='email'
                placeholder='Email Usuario'
                autoComplete='off'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.email && formik.errors.email ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{formik.errors.email}</p>
                </div>
              ): null }

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='password'
                type='password'
                placeholder='Password Usuario'
                autoComplete='off'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{formik.errors.password}</p>
                </div>
              ): null }

              {/* Botton para enviar los datos del formulario  */}
              <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded" value="Crear Cuenta"/>
              <Link href='/login'>
                <a className='text-gray-800 block text-center hover:underline'>
                  Ya tengo una cuenta
                </a>
              </Link>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}