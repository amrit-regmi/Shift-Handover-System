const { ApolloServer,makeExecutableSchema } = require('apollo-server-express')
const { typeDefs } = require('./Src/typeDefs')
const { resolvers } = require('./Src/resolvers')
const mongoose = require('mongoose')
const config = require('./config')
const Station = require('./Src/models/Station')
const jwt = require('jsonwebtoken')
const ConstraintDirective = require('apollo-server-constraint-directive')
const Staff = require('./Src/models/Staff')
const express = require ('express')
const path = require('path')
const app = express()

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives: { constraint: ConstraintDirective }})

const server = new ApolloServer({schema:schema, context: async({req}) => {
  const auth = req? req.headers.authorization : null
  if (auth && auth.toLocaleLowerCase().startsWith('bearer')){
    const token = jwt.verify(auth.substring(7), config.JWT_SECRET)
    const currentStation = await Station.findById(token.stationId)
    const currentUser = await Staff.findById(token.id).populate({ path:'permission' })
    return {currentStation,currentUser,}
  }
}})

app.use(express.static('build'))
  
server.applyMiddleware({ app,path:'/' })

app.listen({ port: config.PORT }, () => {
  console.log('Apollo Server on http://localhost:'+config.PORT );
})

  
mongoose.set('useFindAndModify', false)
const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true  }).then(() => console.info('Connected to MongoDb'))
  .catch(error => {
    console.log('Failed to connect',error.message)
  })




