import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'

import { ApolloClient, HttpLink , InMemoryCache, ApolloProvider } from '@apollo/client'

import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  /**
   * If the user is on staffs page session must have staffKey set , then set authorisation header to staffKey
   */
  let key = JSON.parse(sessionStorage.getItem('staffKey'))

  /**If the staff page is not active then authorisation header is set to stationKey */
  if(!key){
    /**If the login info was saved preiously key will be set else retrive key from session*/
    key =  JSON.parse(localStorage.getItem('stationKey'))
    if(!key) {
      key = JSON.parse(sessionStorage.getItem('stationKey'))
    }
  }

  const token = key? key.value:null
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

