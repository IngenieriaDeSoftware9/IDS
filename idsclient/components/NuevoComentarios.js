import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'  

const CREAR_COMENTARIO = gql`
  mutation insertCommentary($input: CommentaryInput!){
    insertCommentary(input: $input){
      id
      idUser
      idProduct
      description
      creationDate
    }
  }
`

const NuevoComentarios = ({ id }) => {

  const [insertCommentary] = useMutation(CREAR_COMENTARIO)

  const formik = useFormik({
    initialValues: {
      description: ''
    },
    validationSchema: Yup.object({
      description: Yup.string().required('La descripcion es obligatoria'),
    }),
    onSubmit: async valores => {
      const { description } = valores
      try {
        const { data } = await insertCommentary({
          variables:{
            input: {
              idProduct: id,
              description
            }
          }
        })
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  })

  return (
    <div className='w-1/2 mx-auto bg-white p-4 mt-5 rounded border-4 border-gray-800'>
        <h2 className="text-gray-800 text-xl my-5 mb-2">Crear Comentario</h2>

        <form className="bg-gray-800 rounded shadow-md px-8 pt-6 pb-8 mb-4"
          onSubmit={formik.handleSubmit}
        >
          <div className='mb-4'>
            <label className="block text-white text-sm font-bold mb-2" htmlFor="description">Descripcion</label>
            <input className="shadow apparence-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id='description'
            type='text'
            placeholder='descripcion del producto'
            autoComplete='off'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            />

            { formik.touched.description && formik.errors.description ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                <p>{ formik.errors.description }</p>
              </div>
            ): null }

            <input type="submit" className="bg-white w-full mt-5 p-2 text-gray-800 uppercase hover:bg-gray-100 rounded" value="Enviar Comentario"/>

          </div>
        </form>
    </div>
  )
}

export default NuevoComentarios
