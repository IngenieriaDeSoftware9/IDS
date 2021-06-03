import Layout from '../components/Layout'
import Comentario from '../components/Comentario'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

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

export default function Index() {

  const router = useRouter()

  // Consulta de apollo
  const { data, loading, error, client } = useQuery(OBTENER_COMENTARIOS_USUARIO)

  if(loading) return('Cargando...')

  if(!data.getCommentarysUser){
    client.clearStore()
    router.push('/login')
    return <p>Cargando...</p>
  }

  return (
    <div>
      <Layout>
        <h1 className="text-gray-800 text-2xl font-light">Clientes</h1>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Producto</th>
              <th className="w-1/5 py-2">Descripción</th>
              <th className="w-1/5 py-2">Fecha</th>
              <th className="w-1/5 py-2">Eliminar</th>
              <th className="w-1/5 py-2">Editar</th>
            </tr>
          </thead>
            { data.getCommentarysUser.map( comentario => (
              <tbody className='bg-white' key={comentario.id}>
                <Comentario comentario={ comentario }/>
              </tbody>
            ))}
        </table>
      </Layout>
    </div>
  )
}
