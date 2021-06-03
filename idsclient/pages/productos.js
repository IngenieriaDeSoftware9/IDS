import Layout from '../components/Layout'
import Product from '../components/Product'
import { useQuery, gql } from '@apollo/client'

const OBTENER_PRODUCTOS = gql`
  query getProducts{
    getProducts{
      id
      name
      price
    }
  }
`

export default function Productos() {

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)

  if(loading) return 'Cargando...'

  const { getProducts } = data

  return (
    <div>
      <Layout>
      <h1 className="text-gray-800 text-2xl font-light">Productos</h1>
        
        <div className="container mx-auto flex items-center flex-wrap p-3">

          { getProducts.map( product => ( 
            <Product key={product.id} product={ product } />
           ) ) }

        </div>
      </Layout>
    </div>
  )
}