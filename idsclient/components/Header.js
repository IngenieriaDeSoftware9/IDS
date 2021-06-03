import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const OBTENER_USUARIO = gql`
  query getUser{
    getUser{
      id
      name
      lastName
      type
      creationDate
      email
    }
  }
`

const Header = () => {

  const router = useRouter()

  const { data, loading, error, client } = useQuery(OBTENER_USUARIO)

  if(loading) return 'Cargando...'
  
  const cerrarSesion = () => {
    client.clearStore()
    localStorage.removeItem ('token')
    router.push('/login')
    return <p>Cargando...</p>
  }
  
  if(error){
    cerrarSesion()
    return 'Cargando...'
  }

  const { name, lastName } = data.getUser


  return (
    <div className="flex justify-between mb-6">
      <p className='mr-2'>{ name } { lastName }</p>

      { data.getUser.type === 'Admin' ? <p>Administrador</p> : '' }

      <button 
        onClick={ () => cerrarSesion() }
        type='button'
        className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'>
        Cerrar Sesion
      </button>
    </div>
  )
}

export default Header
