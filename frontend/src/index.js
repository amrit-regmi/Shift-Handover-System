import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'

import { ApolloClient, HttpLink , InMemoryCache, ApolloProvider} from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Container><App /></Container>
  </ApolloProvider>,
  document.getElementById('root')
);

