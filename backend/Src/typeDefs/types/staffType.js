const staffType =  `
  type Staff {
    id: ID!
    name: String!
    idCardCode: String
    currentStation: Station
    email: String!
    position:String
    contractType:String
    lastActive: LastActive
    username:String
    registerCode:String
    resetCode: String
    permission:Permission
    reqHours:Int
    phone: String
    disabled: Boolean
    
  }

  type LastActive {
    station: Station
    activeAt: Date
  }

`

module.exports =  staffType

/**/