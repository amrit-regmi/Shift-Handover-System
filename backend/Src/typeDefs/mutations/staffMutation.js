const staffMutation = `
  extend type Mutation {
    addStaff(
      name: String!,
      idCardCode: String
      email: String!
      position:String
      contractType:String!
      contractHours: Int!
      ):Staff

    
    resetRegisterCode(
      id: String!
    ):ResponseMessage

    registerStaff(
      username:String!
      password: String!
      registerCode:String!
    ):ResponseMessage
    
    resetPassword(
      resetCode: String
      password: String
    ):ResponseMessage

    resetPasswordReq(
      id: String
    ):ResponseMessage

    changePassword(
      id: String
      password: String
      newPassword: String
    ):ResponseMessage

    staffLogin(
      username: String!
      password:String
    ):JsonObject

    staffEdit(
      id: String!
      email: String
      phone: String
      contractType: String
      reqHours: Float
      position: String
    ): Staff


    }


`

module.exports = {
  staffMutation
}