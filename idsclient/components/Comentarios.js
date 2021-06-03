import React from 'react'
import { useQuery, gql } from '@apollo/client'

const COMENTARIOS_PRODUCTO = gql`
  query getCommentarysProduct($id: ID!){
    getCommentarysProduct(id: $id){
      id
      idUser
      idProduct
      description
      creationDate
    }
  }
`

const Comentarios = ({id}) => {

  const { data, loading, error } = useQuery(COMENTARIOS_PRODUCTO, {
    variables: {
      id
    }
  })

  if( loading ) return 'Cargando...'

  const { getCommentarysProduct } = data

  return (
    <div className='bg-white p-4 mt-5 rounded border-4 border-gray-800'>
      <h2 className="text-gray-800 text-xl my-5 mb-2">Comentarios</h2>
      { getCommentarysProduct.map( comentario => (
        <div className="border border-gray-800 bg-white mb-2 py-2 px-5 rounded">
          {comentario.description}
        </div>
      )) }
    </div>
  )
}

export default Comentarios
