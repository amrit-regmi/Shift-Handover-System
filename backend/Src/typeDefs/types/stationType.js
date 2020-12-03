const stationType = `
  type Station {
    id: ID!
    location: String
    address: Address
    costumers: [Costumer]
    shifts: [ShiftInfo]
    phone: [String]
    email: String
    procedures: [Procedure]
    activeStaffs: Int
    staffList: [Staff]
  }

  type ShiftInfo {
    name: String
    startTime: String
  }

  type Address{
    country: String
    postcode: String
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