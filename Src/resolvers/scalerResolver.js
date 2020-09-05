const { GraphQLJSONObject }  = require ('graphql-type-json')
const { GraphQLDateTime,GraphQLDate } = require ('graphql-iso-date')

const scalarResolver = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  JsonObject : GraphQLJSONObject
}

module.exports = { scalarResolver }