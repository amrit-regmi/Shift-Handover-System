const staffType =  `
  type Staff {
    id: ID!
    name: String!
    idCardCode: String
    currentStation: Station
    email: String!
    position:String
    contractType:String
    lastActive: String
    username:String
    passwordHash: String
    registerCode:String
    resetCode: String
  }

`

module.exports =  staffType

/**/