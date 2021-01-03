const taskType = `
  type Task {
    id:ID
    taskCategory: TaskCategory!
    aircraft: Aircraft
    description: String!
    status: TaskStatus
    createdAt: Date
    createdBy: Staff
    updates: [Update]
  }

  type Update {
    handoverId: String!
    handoverDetail:String
    action: Action! 
    note: String

  }
`

module.exports =  taskType