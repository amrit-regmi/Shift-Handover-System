const enumType =  `
    
  type ResponseMessage{
    status: Response
    message: String
  }

  enum Response {
    SUCCESS,
    ERROR
    WARNING
  }

  enum TaskCategory {
    AIRCRAFT
    LOGISTICS
    OTHER
  }

  enum TaskStatus {
    DEFERRED
    CLOSED
    OPEN
  }

  enum Action {
    DEFERRED 
    CLOSED 
    OPEN 
    NOTES_ADDED 
    TASK_CREATED
  }
`

module.exports =  enumType