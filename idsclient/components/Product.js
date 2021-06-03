import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Product = ( { product } ) => {

  const router = useRouter()

  const { name, price, id } = product

  const src = '/' + name + '.jpg'

  const vamosAPedido = () => {
    router.push({
      pathname: '/producto/[id]',
      query: { id }
    })
  }


  return (
    <div className="rounded bg-white w-full md:w-1/2 xl:w-1/3 p-6 flex justify-center flex-col">
      <div className='bg-gray-800 text-center p-2 rounded'>
        <Image 
          className='rounded w-1/5'
          src={src}
          width={500}
          height={400}
        />
      </div>
      <p className="text-center">{ name }</p>
      <p className="text-center">{ price } $</p>
      <button className='text-white bg-gray-800 text-center py-2 rounded'
        onClick={ () => vamosAPedido() }
      >
        Más
      </button>
    </div>
  )
}

export default Product
