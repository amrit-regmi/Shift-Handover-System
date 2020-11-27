const stationType = `
  type Station {
    id: ID!
    location: String!
    costumers: [Costumer]
    shifts: [ShiftInfo]
    phone: String
    email: String
    procedures: [Procedure]
  }

  type ShiftInfo {
    name: String
    startTime: String
  }

  type Location{
    airportCode: String!
    country: String
    city:String
    street: String
  }

  type Procedure{
    title:String!
    description: String!
  }
`

module.exports =  stationType
/* staffList: [Staff]*/