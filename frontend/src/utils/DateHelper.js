import { isNumber } from 'lodash'

/**
 *
 * @param {int javascript date} dateToFormat
 */
export const formatDate = (dateToFormat) => {

  const date = new Date(dateToFormat)

  return (`${(date.getDate()).toString().padStart(2,0)}-${(date.getMonth()+1).toString().padStart(2,0)}-${date.getFullYear()} ${(date.getHours()).toString().padStart(2,0)}:${(date.getMinutes()).toString().padStart(2,0)}`)

}

/**
 *
 * @param {int or date format} date javascript date int or DD-MM-YYYY
 * @param {Double} duration duration to operate
 * @param {String} unit 'd for days, h for hours , m for minutes'
 * @param {String} operation 'add or sub'
 * @returns {string} Date format DD-MM-YYYY HH:MM
 */
export const operateDate = (date, duration, unit , operation) => {
  if(!date){
    return null
  }
  let ndate
  if(!isNumber(date)){
    const splitDateTime = date.split(' ')
    const splitDate = splitDateTime[0].split('-')
    const newDate =`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} ${splitDateTime[1]}`

    ndate = Date.parse(newDate)

  }
  else{
    ndate = new Date(date)
  }

  switch (unit){
  case 'd':
    if(operation === 'add') return  formatDate((ndate + (duration * 24 * 60 * 60 * 1000)))
    if(operation === 'sub') return  formatDate((ndate - (duration * 24 * 60 * 60 * 1000)))
    break
  case 'h':
    if(operation === 'add') return formatDate((ndate + (duration * 60 * 60 * 1000)))
    if(operation === 'sub') return  formatDate((ndate - (duration * 60 * 60 * 1000)))
    break
  case 'm':
    if(operation === 'add') return formatDate((ndate + (duration * 60 * 1000)))
    if(operation === 'sub') return  formatDate(ndate - (duration * 60 * 1000))
    break
  default:
    return formatDate(ndate)
  }
}

/**
 *
 * @param {String} stringDate format DD-MM-YYYY HH:MM
 * @returns {Int} Javascript date int
 */
export const toDate = (stringDate) => {
  let ndate
  if(!isNumber(stringDate)){
    const splitDateTime = stringDate.split(' ')
    const splitDate = splitDateTime[0].split('-')
    const newDate =`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} ${splitDateTime[1] || '00' }:${splitDateTime[2] | '00'}`

    ndate = Date.parse(newDate)
  }
  else{
    ndate = new Date(stringDate)
  }

  return ndate

}

export const getWeekNumber= (dt) => {
  var tdt = new Date(dt.valueOf())
  var dayn = (dt.getDay() + 6) % 7
  tdt.setDate(tdt.getDate() - dayn + 3)
  var firstThursday = tdt.valueOf()
  tdt.setMonth(0, 1)
  if (tdt.getDay() !== 4)
  {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}

/**
* Returns the week start date(Monday) for given year and weeknumber
* @param {Int} w between 1-52/53
* @param {Int} y year
* @returns {Date}
*/
export const getDatefromWeek = (w,y) => {
  const simpleStartDate = new Date(Date.UTC(y,0,1 + (w-1) *7))
  const dayOfWeek = simpleStartDate.getDay()

  let IsoWeekStart = simpleStartDate
  if(dayOfWeek <=4) {
    IsoWeekStart.setDate(simpleStartDate.getDate() - simpleStartDate.getDay()+1)
  }else {
    IsoWeekStart.setDate(simpleStartDate.getDate()+8 - simpleStartDate.getDay())
  }
  return IsoWeekStart
}

export const getMonthInt= (name) => {
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december']
  const ind = months.findIndex((month) => {
    return month === name.toLowerCase()
  })
  return ind
}

/**
  * Positive prop gets month from  beginning of year
  * Negative index gets month from end  of year
  * @param  {Int} monthInt Month Number
  */
export const getMonthName = (monthInt) => {
  const months = new Proxy(['January','February','March','April','May','June','July','August','September','October','November','December'], {
    get(target, prop) {
      if (!isNaN(prop)) {
        prop = parseInt(prop, 10)
        if (prop < 0) {
          prop += target.length
        }
      }
      return target[prop]
    }
  })
  return months[monthInt]
}

/**
 * Retrive months form given month duration including current month
 *
 *  */
export const getMonthOptions = (duration) => {
  /**Default Duration is 4 months */
  if(!duration ){
    duration = 4
  }

  const today = new Date()
  const currentMonth = today.getMonth()

  const options = [...new Array(duration)].map((v,i) => {
    return (
      { key:i ,
        text: getMonthName[currentMonth - i ] , value: currentMonth -1 < 0 ? 11 + currentMonth -i  : currentMonth -i }
    ) })
  return options
}

/**Retrieve all weeks that falls within given month duration including current month*/
export const getWeekOptions = (duration) => {
  /**Default Duration is 4 months */
  if(!duration ){
    duration = 4
  }
  const today = new Date()
  const currentMonth = today.getMonth()
  let dYear = today.getFullYear()
  const lastYearWeekNum = getWeekNumber( new Date(dYear-1,11,28))
  const lastRetriveable  = getWeekNumber(new Date(dYear, currentMonth - duration ,1))
  let currentWeek = getWeekNumber(today)
  let options = []

  let week = currentWeek
  while ( week !== lastRetriveable-1  ){
    const option = { key: week, text: week, value: week }
    options.push (option )
    week = week -1
    if(week === 0) {
      week = lastYearWeekNum
    }
  }
  return options

}

