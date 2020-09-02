const { types } = require('./types/')
const { queries } = require('./queries/')
const { mutations } = require('./mutations/')

const Query = `
  type Query {
    _empty: String
  }`

const Mutation = `
type Mutation {
  _empty: String
}`

const typeDefs = [Query,...types,...queries,Mutation,...mutations]
module.exports = { typeDefs }