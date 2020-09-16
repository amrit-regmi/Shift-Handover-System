import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'

import { ApolloClient, HttpLink , InMemoryCache, ApolloProvider } from '@apollo/client'

import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  let verified =  JSON.parse(localStorage.getItem('stationKey'))
  if(!verified) {
    verified = JSON.parse(sessionStorage.getItem('stationKey'))
  }
  const token = verified? verified.value:null
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:  authLink.concat(httpLink)
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Container><App /></Container>
  </ApolloProvider>,
  document.getElementById('root')
)

