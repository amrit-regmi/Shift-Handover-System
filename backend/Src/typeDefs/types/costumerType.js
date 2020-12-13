const costumerType =  `
  type Costumer {
    id: ID!
    name: String
    stations: [Station]
    aircrafts: [Aircraft!]
    contract: String
    keyContacts: [Contact] 
  }

  type Contact{
    id:ID
    phone: String
    description: String!
    email: String
  }
`

module.exports =  costumerType

