import React from 'react'
import Layout from '../../components/Layout'
import Comentarios  from '../../components/Comentarios'
import NuevoComentarios  from '../../components/NuevoComentarios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'

const OBTENER_PRODUCTO = gql`
  query getProduct($id: ID!){
    getProduct(id: $id){
      name
      description
      price
      ingredients
      type
      creationDate
    }
  }
`

export const pedido = () => {

  const router = useRouter()
  
  const { query: { id } } = router
  
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO,{
    variables: {
      id
    }
  })

  if( loading ) return 'Cargando...'

  if(error || !data.getProduct){
    router.push('/productos')
    return 'Cargando...'
  }

  const { name, price, description, ingredients } = data.getProduct
  const src = '/' + name + '.jpg'

  return (
    <Layout>
      <div className='bg-gray-800 text-center p-5 rounded'>
      <h1 className="text-white text-2xl font-light mb-2">{name}</h1>
        <Image 
          className='rounded w-1/5'
          src={src}
          width={450}
          height={350}
        />
        <p class="text-center text-white">
          <span className='font-black text-blue-800'>Precio:</span> { price } $
        </p>
        <p class="text-center text-white">{ description }</p>
        <p class="text-center font-black text-blue-800">Ingredientes:</p>
        <p class="text-center text-white">{ ingredients }</p>
      </div>

      <Comentarios id={id} />
      <NuevoComentarios id={id} />
    </Layout>
  )
}

export default pedido