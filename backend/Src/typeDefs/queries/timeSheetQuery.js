const  timeSheetQuery = `
  extend type Query {
    getTimeSheetsByUser(
      id:String!
      filterDuration: FilterDuration!
    )
    : [TimeSheet]



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

getTimeSheetById(
  id:String !
  filterDuration: FilterDuration!
  )
  :TimeSheet



  type FilterDuration{
    week: Int
    month: Int
    from: Date
    to: Date
  } */
