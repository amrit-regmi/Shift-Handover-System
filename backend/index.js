const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const { typeDefs } = require('./Src/typeDefs')
const { resolvers } = require('./Src/resolvers')
const mongoose = require('mongoose')
const config = require('./config')

const schema = makeExecutableSchema({
  typeDefs, resolvers
})

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


mongoose.set('useFindAndModify', false)
const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true  }).then(() => console.info('Connected to MongoDb'))
  .catch(error => {
    console.log('Failed to connect',error.message)
  })