const staffMutation = `
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
    ):Staff

    resetPassword(
      id: String
      resetCode: String
      password: String
    ):ResponseMessage
    }


`

module.exports = {
  staffMutation
}