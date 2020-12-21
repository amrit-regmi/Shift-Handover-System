const { groupBy, mapValues, chain, map } = require('lodash')
const style = require('./style').getShiftReportStyle()
const transporter = require('./transporter')
const generateShiftReportEmail = (shiftReportData) => {

  const tasksByCat = groupBy(shiftReportData.tasks, task => task.taskCategory)
  const tasks = mapValues(
    tasksByCat,(cat,k) =>
      k === 'AIRCRAFT'?
        chain(tasksByCat.AIRCRAFT)
          .groupBy(taskcat  =>  taskcat.aircraft.costumer.name)
          .mapValues( costumer => {
            return(groupBy(costumer, task => task.aircraft.registration))
          })
          .value()
        :cat
  )


  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Complete Registraion </title>
    ${style}
  </head> 
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
            <!-- Logo -->
            <tr>
              <td class="email-masthead">
                <a class="email-masthead_name">Shift Reporting System</a>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="100%">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                    <div>
                      <div  class='title'>
                        <h4>Line Maintenance Shift Handover <br>
                          <span class='station'>${shiftReportData.station.location}</span>
                        </h4>
                      </div>
                      <table >
                        <tbody>
                          <tr>
                            <td
                              class ='header'>
                              <b>Shift </b><br>
                            </td>
                            <td
                              class ='header'>
                              <b>Shift Start </b>
                            </td>
                            <td
                              class ='header'>
                              <b>Shift End </b><br>
                            </td>
                          </tr>
                          <tr>
                            <td class='tableCell'>${shiftReportData.shift}</td>
                            <td class='tableCell'>${shiftReportData.startTime.substring(10)}</td>
                            <td class='tableCell'>${shiftReportData.endTime.substring(10)}</td>
                          </tr>
                          <tr class='empty'>
                          </tr>
                          <tr>
                            <td colspan="3"
                              class='header'>
                              <b>Staff</b>
                            </td>
                          </tr>
                          ${ shiftReportData.staffAndTime.map(timesheet => `
                          <tr>
                            <td class='tableCell'>${timesheet.staff.name}</td>
                            <td class='tableCell'>${timesheet.startTime.substring(10)}</td>
                            <td class='tableCell'>${timesheet.endTime.substring(10)}</td>
                          </tr>`)}
                          <tr class='empty'>
                          </tr>
                          ${ map(tasks, (tasksByType,key_taskType) => {// eslint-disable-next-line indent
                             if(key_taskType === 'AIRCRAFT') { // eslint-disable-next-line indent
                               return map(tasksByType,(aircrafts,key_costumerName) => `
                                <tr >
                                  <td colspan="3" class='header'>
                                    <b>Work Performed for ${key_costumerName}</b>
                                  </td>
                                </tr>

                                ${map(aircrafts,(tasks,key_aircraft) => `      
                                    <tr>
                                    <td colspan="3" class='taskBox'
                                      >
                                      <b>${key_aircraft}</b>
                                      ${map(tasks,(task,index) => `
                                        <div class='taskBoxInner'>
                                          <div class='taskNumber'>
                                            ${index+1}. 
                                          </div>
                                            <div>
                                              <div>
                                              ${task.updates.length > 1 ?// eslint-disable-next-line indent
                                              `<div class='taskLabel'>
                                                 Deferred from last Shift
                                                </div>` :''// eslint-disable-next-line indent
                                              }
                                                ${task.status === 'CLOSED' ?// eslint-disable-next-line indent
                                                `<div class='taskLabel closed'>
                                                    Closed
                                                 </div>`:''// eslint-disable-next-line indent
                                                }
                                                ${task.status === 'OPEN' ?// eslint-disable-next-line indent
                                                `<div class='taskLabel open'>
                                                    Open Task
                                                 </div>`:''// eslint-disable-next-line indent
                                                }
                                                ${task.status === 'DEFERRED' ?// eslint-disable-next-line indent
                                                `<div class='taskLabel deferred'>
                                                    Deferred
                                                 </div>
                                                 <div class='taskLabel actionRequired'>
                                                 Action Required
                                              </div>`:''// eslint-disable-next-line indent
                                                }
                                               
                                              </div>
                                               ${task.description} 
                                            </div>
                                        </div>

                                      `).toString().replace(',','')}
                                    </td>
                                  </tr>
                                `).toString().replace(',','')}
                            `).toString().replace(',','')// eslint-disable-next-line indent
                          }else{// eslint-disable-next-line indent
                              return`
                              <tr >
                                  <td colspan="3" class='header'>
                                    <b>${key_taskType}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="3" class='taskBox'>
                              
                                    ${map(tasksByType,(task,index) => `
                                    
                                            <div class='taskBoxInner'>
                                                <div class='taskNumber'>
                                                  ${index+1}. 
                                                </div>
                                                  <div>
                                                    <div>
                                                    ${task.updates.length > 1 ?// eslint-disable-next-line indent
                                                    `<div class='taskLabel'>
                                                      Deferred from last Shift
                                                      </div>` :''// eslint-disable-next-line indent
                                                    }
                                                      ${task.status === 'CLOSED' ?// eslint-disable-next-line indent
                                                      `<div class='taskLabel closed'>
                                                          Closed
                                                      </div>`:''// eslint-disable-next-line indent
                                                      }
                                                      ${task.status === 'OPEN' ?// eslint-disable-next-line indent
                                                      `<div class='taskLabel open'>
                                                          Open Task
                                                      </div>`:''// eslint-disable-next-line indent
                                                      }
                                                      ${task.status === 'DEFERRED' ?// eslint-disable-next-line indent
                                                      `<div class='taskLabel deferred'>
                                                          Deferred
                                                      </div>
                                                      <div class='taskLabel actionRequired'>
                                                      Action Required
                                                    </div>`:''// eslint-disable-next-line indent
                                                      }
                                                    
                                                    </div>
                                                    ${task.description} 
                                                  </div>
                                            </div>
                                            
                                    

                                      `).toString().replace(',','')} 
                                  <td>
                              <tr>`// eslint-disable-next-line indent
                            } // eslint-disable-next-line indent
                          }) // eslint-disable-next-line indent
                        }
                        </tbody>
                      </table>
                    </div>
                    <!-- Sub copy -->
                    <table class="body-sub">
                      <tr>
                        <td>
                          <p class="sub">This is a auto-generated email, please do not reply to this email. Should you have any question about the system, please do not hesitate to  contact support.
                          </p>
                        </td>
                      </tr>
                    </table>
                </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-cell">
                      <p class="sub center">
                        Template Aircraft Maintentce Company
                        <br>Airport Road 1 , 01760 Helsinki , Finland
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}

const sendUShiftReportEmail = async (shiftReportData,emails) => {
  try{
    const m =  await  transporter.sendMail({
      to: 'rit.regmi@gmail.com',
      subject:`Shift Report from ${shiftReportData.station.location} ${shiftReportData.shift} shift - ${shiftReportData.startTime}`,
      html: generateShiftReportEmail(shiftReportData) })
    return m
  }
  catch(error) {
    console.log(error)
    throw new Error('Verification email could not be sent, please try again')
  }
}


module.exports = { sendUShiftReportEmail }