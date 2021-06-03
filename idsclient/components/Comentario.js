import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

// Query para obtener el producto
const OBTENER_PRODUCTO = gql`
  query getProduct($id: ID!){
    getProduct(id: $id){
      id
      name
      description
      price
      ingredients
      type
      creationDate
    }
  }
`

// Mutation para eliminar un comentario
const ELIMINAR_COMENTARIO = gql`
  mutation deleteCommentary($id: ID!){
    deleteCommentary(id: $id)
  }
`

// Query para actualizar el cache
const OBTENER_COMENTARIOS_USUARIO = gql`
  query getCommentarysUser{
    getCommentarysUser{
      id
      idUser
      idProduct
      description
      creationDate
    }
  }
`

const Comentario = ({ comentario }) => {

  const router = useRouter()

  // Obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id: comentario.idProduct
    }
  })

  // Eliminar el comentario y actualizar el cache
  const [ deleteCommentary ] = useMutation(ELIMINAR_COMENTARIO, {
    update(cache){
      // Obtener una copia de chache
      const { getCommentarysUser } = cache.readQuery({ query: OBTENER_COMENTARIOS_USUARIO })

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_COMENTARIOS_USUARIO,
        data: { 
          getCommentarysUser: getCommentarysUser.filter( comentarioActual => comentarioActual.id !== id)
         }
      })
    }
  })

  if(loading) return 'Cargando...'

  const { name } = data.getProduct

  const { id, description, creationDate } = comentario

  const confirmarEliminarComentario = (id) => {
    Swal.fire({
      title: 'Deseas eliminar a este comentario?',
      text: "esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then( async (result) => {
      if (result.isConfirmed) {

        try {
          // Eliminar por id
          const { data } = await deleteCommentary({
            variables:{
              id
            }
          })

          // Mostrar una alerta
          Swal.fire(
            'Eliminado!',
            'Se ha eliminado correctamente',
            'success'
          )
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

  const confirmarEditarCliente = (name) => {
    router.push({
      pathname: '/editarcliente/[id]',
      query: { id, name }
    })
  }

  return (
    <tr>
      <td className="border px-4 py-2">{name}</td>
      <td className="border px-4 py-2">{description}</td>
      <td className="border px-4 py-2">{creationDate}</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-600 py-2 px-4 rounded w-full text-white text-xs uppercase font-bold text-center"
          onClick={ () => confirmarEliminarComentario(id) }
        >
          Eliminar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 ml-2 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-yellow-600 py-2 px-4 rounded w-full text-white text-xs uppercase font-bold text-center"
          onClick={ () => confirmarEditarCliente(name) }
        >
          Editar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </td>
    </tr>
  )
}

export default Comentario
