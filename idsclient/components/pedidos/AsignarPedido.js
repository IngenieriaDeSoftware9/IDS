import { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'

// Context de pedidos
import PedidoContext from '../../context/pedidos/PedidoContex'

const OBTENER_PRODUCTOS = gql`
  query getProducts{
    getProducts{
      id
      name
    }
  }
`

const AsignarPedido = () => {

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)

  const [ product, setProduct ] = useState([])

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext)
  const { agregarPedido } = pedidoContext
  
  useEffect(() => {
    agregarPedido(product)
  }, [product])
  
  const seleccionarProductos = product => {
    setProduct(product)
  }
  
  if(loading) return 'Cargando...'

  const { getProducts } = data

  return (
    <>
    <p className='mt-10 mt-2 bg-white border-l-4 border-gray-800 border-gray-700 p-2 text-sm font-bold'>1.- Asigna los productos al pedido</p>
    <Select className='mt-3' 
      options={ getProducts }
      isMulti={ true }
      onChange={ ( seleccionada ) => seleccionarProductos( seleccionada ) }
      getOptionValue={ opciones => opciones.id }
      getOptionLabel= { opciones => opciones.name }
      placeholder='Seleccionar un producto'
      noOptionsMessage={ () => 'Ese producto no existe' }
    />
    </>
  )
}

export default AsignarPedido
