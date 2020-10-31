const permissionType = `
  type Permission {
    id: ID!
    staffId: Staff!
    staff: JsonObject!
    station: JsonObject!
    timesheet: JsonObject!
    super: Boolean
  }
`
module.exports = permissionType