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
`

module.exports =  enumType