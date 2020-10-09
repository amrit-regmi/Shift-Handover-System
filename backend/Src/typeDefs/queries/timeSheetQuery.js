const  timeSheetQuery = `
  extend type Query {
    getTimeSheetByUser(
      staff:String!
      filterDuration: String!
      number: Int!
      year: Int!
      )
      :[TimeSheet]

  } 

 
`


module.exports ={ timeSheetQuery }
/*
getTimeSheetsByStation(
  id:String!
  filterDuration: FilterDuration!
  )
  : [TimeSheet]

getTimeSheetsByHandover(
  id:String!
  filterDuration: FilterDuration!
  )
  : [TimeSheet]

  getTimeSheetByUser(
  staff:String !
  filterDuration: String
  number: Int

  )
  :TimeSheet



  type FilterDuration{
    week: Int
    month: Int
    from: Date
    to: Date
  } */
