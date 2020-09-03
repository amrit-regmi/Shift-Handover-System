
const staffQuery = `
extend type Query {
  allStaff(currentStation:String,contractType: String ) : [Staff]
  getStaff(id:String,registerCode:String): Staff
}
`

module.exports = {
  staffQuery
}