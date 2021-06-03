import { ApolloProvider } from '@apollo/client'
import client from '../config/apollo'
import PedidoState from './../context/pedidos/PedidoState'

const MyApp = ({ Component, pageProps }) => {
  return (
    // Se indica que la pagina funciona con servicios de apollo
    <ApolloProvider client={client}>
      <PedidoState>
        <Component {...pageProps} />
      </PedidoState>
    </ApolloProvider>
  )
}

export default MyApp
