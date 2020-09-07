

const costumerQuery = `
  extend type Query {
    allCostumers: [Costumer]
    getCostumer(name:String,id:String): Costumer
  }
`

module.exports = {
  costumerQuery
}