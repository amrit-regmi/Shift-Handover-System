
const staffQuery = `
extend type Query {
  allStaff(currentStation:String, contractType: String , minimal: Boolean) : [Staff]
  getStaff(id:String,registerCode:String): Staff
  verifyUsername( username: String!):ResponseMessage
  getStaffName(id: String):String
}
`

module.exports = {
  staffQuery
}