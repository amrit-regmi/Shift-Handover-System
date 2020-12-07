const costumerType =  `
  type Costumer {
    id: ID!
    name: String
    stations: [Station]
    aircrafts: [Aircraft!]
    contract: String
    keyContacts: [PhoneNumbers] 
  }

  type PhoneNumbers{
    phone: String!
    description: String
  }
`

module.exports =  costumerType

