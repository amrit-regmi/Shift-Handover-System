const { types } = require('./types/')
const { queries } = require('./queries/')
const { mutations } = require('./mutations/')


const typeDefs = [...types,...queries,...mutations]
console.log(typeDefs)
module.exports = { typeDefs }