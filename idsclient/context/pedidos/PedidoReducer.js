import {
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTO
} from './../../types'

export default  ( state, action ) => {
  
  switch(action.type) {
    case SELECCIONAR_PRODUCTO: 
      return {
        ...state,
        productos: action.payload
      }
    
    default:
      return state
  }
}