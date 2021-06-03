import Layout from '../components/Layout'
import AsignarPedido  from '../components/pedidos/AsignarPedido'
import { useContext } from 'react'

// Context de pedidos
import PedidoContext from '../context/pedidos/PedidoContex'

const nuevopedido = () => {
  

  // Utilizar contex y extraer sus valores
  const pedidoContext = useContext(PedidoContext)

  return (
    <Layout>
      <h1 className="text-gray-800 text-2xl font-light">Nuevo Pedidos</h1>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <AsignarPedido />
        </div>
      </div>
    </Layout>
  )
}

export default nuevopedido
