import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'

const OBTENER_COMENTARIO = gql`
  query getCommentary($id: ID!){
    getCommentary(id: $id){
      id
      idUser
      idProduct
      description
      creationDate
    }
  }
`

const ACTUALIZAR_COMENTARIO = gql`
  mutation updateCommentary($id: ID!, $input: CommentaryInput!){
    updateCommentary(id: $id, input: $input){
      id
      idUser
      idProduct
      description
      creationDate
    }
  }
`

const editarcliente = () => {

  const router = useRouter()
  
  const { query: { id, name } } = router
  
  const { data, loading, error } = useQuery(OBTENER_COMENTARIO, {
    variables:{
      id
    }
  })
  
  const [updateCommentary] = useMutation(ACTUALIZAR_COMENTARIO)
  
  if(loading) return 'Cargando...'
  
  if(error || !data.getCommentary){
    router.push('/')
    return 'Cargando...'
  }

  // Schema de validacion
  const schemaValidation = Yup.object({
    description: Yup.string().
                      required('La descripción es necesaria')
  })

  const { getCommentary } = data

  const confirmarActualizarComentario = async (values) => {
    const { description } = values
    try {
      const { data } = await updateCommentary({
        variables:{
          id,
          input: {
            idProduct: getCommentary.idProduct,
            description: description
          }
        }
      })
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <Layout>
      <h1 className="text-gray-800 text-2xl font-light">Editar Comentario</h1>
      <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <Formik
              validationSchema={ schemaValidation }
              enableReinitialize
              initialValues= { getCommentary }
              onSubmit= { (values) =>  confirmarActualizarComentario(values) }
            >
              {
                props => {
                  return (
                    <form 
                      className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                      onSubmit={props.handleSubmit}
                    >

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Producto</label>
                        <p>{name}</p>
                      </div>

                      {/* Bloque para llenar un dato del formulario */}
                      <div className='mb-4'>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripción</label>
                        <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id='description' // Para identificar el input
                        type='description' // El tipo del input
                        placeholder='descripcion Comentario' // Lo que dice el input
                        autoComplete='off' // Para no mostrar opciones en el input
                        value={props.values.description}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        />
                      </div>

                      { props.touched.description && props.errors.description ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                          <p>{props.errors.description}</p>
                        </div>
                      ): null }

                      {/* Botton para enviar los datos del formulario  */}
                      <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded" value="Actualizar Usuario"/>
                    </form>
                  )
                }
              }
            </Formik>
          </div>
        </div>
    </Layout>
  )
}

export default editarcliente
