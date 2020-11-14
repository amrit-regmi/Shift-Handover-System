
const staffQuery = `
extend type Query {
  allStaff(currentStation:String,contractType: String ) : [Staff]
  getStaff(id:String,registerCode:String): Staff
  verifyUsername( username: String!):ResponseMessage

}
`

module.exports = {
  staffQuery
}