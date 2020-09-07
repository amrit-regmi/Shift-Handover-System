const taskType = `
  type Task {
    id:ID
    taskCategory: TaskCategory!
    shiftReport: ShiftReport!
    aircraft: Aircraft
    description: String!
    status: TaskStatus
    createdAt: Date
    createdBy: Staff
    updates: [JsonObject]

  }
`

module.exports =  taskType