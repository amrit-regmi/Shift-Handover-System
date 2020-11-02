const permissionMutation = `
  extend type Mutation {
    changePermission(
      id: String!
      staff: JsonObject
      station: JsonObject
      timesheet: JsonObject
      admin: Boolean
      ):Permission
    }`

module.exports = { permissionMutation }