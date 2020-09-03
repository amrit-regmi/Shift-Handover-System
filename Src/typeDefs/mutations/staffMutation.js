const stationMutation = `
  extend type Mutation {
    addStaff(
      name: String!,
      idCardCode: String
      email: String!
      position:String
      contractType:String
      ):Staff
    
    registerStaff(
      idCardCode: String
      position:String!
      contractType:String!
      username:String!
      passwordHash: String!
      registerCode:String!
    )

    resetPassword(
      resetCode: String!
      password: String!
    )
    }

`

module.exports = {
  stationMutation
}