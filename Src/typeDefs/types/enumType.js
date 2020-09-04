const enumType =  `
    
  type Message{
    status: Status
    message: String
  }

  enum Status {
    SUCCESS,
    ERROR
    WARNING
  }
`

module.exports = { enumType }