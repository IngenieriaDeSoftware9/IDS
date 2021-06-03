import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'  
import { useMutation, gql } from '@apollo/client'

const AUTENTICAR_USUARIO = gql`
  mutation authenticateUser($input: authenticateInput!){
    authenticateUser(input: $input){
      token
    }
  }
`

export default function Login() {
  const [mensaje, setMensaje] = useState(null)

  const router = useRouter()

  const [authenticateUser] = useMutation(AUTENTICAR_USUARIO)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('El email no es valido')
                .required('El email es obligatorio'),
      password: Yup.string().required('El password es obligatorio')
    }),
    onSubmit: async valores => {
      const { email, password } = valores
      try {
        const { data } = await authenticateUser({
          variables:{
            input: {
              email,
              password
            }
          }
        })
        setMensaje('Autenticando...')

        // Guardar token
        const { token } = data.authenticateUser
        localStorage.setItem('token', token)

        // Redireccionar a perfil
        setTimeout(() => {
          router.push('/')
        }, 3000);
      } catch (error) {
        setMensaje(error.message)
        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    }
  })

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
        { mensaje  && mostarMensaje() }
        <h1 className="text-white text-2xl font-light text-center">Login</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='email'
                type='email'
                placeholder='Email Usuario'
                autoComplete='off'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                />
              </div>

              { formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{formik.errors.password}</p>
                </div>
              ): null }

              <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded" value="Iniciar Sesion"/>
              <Link href='/nuevacuenta'>
                <a className='text-gray-800 block text-center hover:underline'>
                  registrarse
                </a>
              </Link>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}
