const permissionType = `
  type Permission {
    id: ID!
    staffId: Staff!
    staff: JsonObject!
    station: JsonObject!
    timesheet: JsonObject!
    admin: Boolean
  }
`
module.exports = permissionType