import { useReducer } from 'react'
import PedidoContext from './PedidoContex'
import PedidoReducer from './PedidoReducer'

import {
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTO
} from './../../types'

const PedidoState = ({children}) => {

  // State de pedidos
  const initialState = {
    productos: [],
    total: 0
  }

  const [ state, dispatch ] = useReducer(PedidoReducer, initialState)

  // Modifica el pedido
  const agregarPedido = pedido => {
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: pedido
    })
  }

  return (
    <PedidoContext.Provider 
      value={{
        agregarPedido
      }}
    >
      { children }
    </PedidoContext.Provider>
  )
}

export default PedidoState