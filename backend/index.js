const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const { typeDefs } = require('./Src/typeDefs')
const { resolvers } = require('./Src/resolvers')
const mongoose = require('mongoose')
const config = require('./config')
const Station = require('./Src/models/Station')
const jwt = require('jsonwebtoken')
const ConstraintDirective = require('apollo-server-constraint-directive')
const Staff = require('./Src/models/Staff')

const schema = makeExecutableSchema({
  typeDefs, resolvers, schemaDirectives: { constraint: ConstraintDirective }

})

const server = new ApolloServer({ schema ,
  context: async({req}) => {
    const auth = req? req.headers.authorization : null
    if (auth && auth.toLocaleLowerCase().startsWith('bearer')){
      const token = jwt.verify(auth.substring(7), config.JWT_SECRET)
      const currentStation = await Station.findById(token.stationId)
      const currentUser = await Staff.findById(token.userId)
      
      return {currentStation,currentUser}
    }
  }})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


mongoose.set('useFindAndModify', false)
const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true  }).then(() => console.info('Connected to MongoDb'))
  .catch(error => {
    console.log('Failed to connect',error.message)
  })