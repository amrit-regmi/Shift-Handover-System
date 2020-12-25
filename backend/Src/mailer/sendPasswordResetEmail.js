const config = require('../../config')
const  style = require('./style').getBasicStyle()

const transporter = require('./transporter')
const hostname = config.FQDN || 'localhost:3000'
const generatePasswordResetEmail = (resetCode, name) => {
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
                      <h1>Hello ${name}, </h1>
                      <p>You recently requested to reset your password for your personal account. click the button below to reset.</p>
                      <!-- Action -->
                      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <div>
                              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{action_url}}" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">
                              <v:fill type="tile" color="#414EF9" />
                              <w:anchorlock/>
                              <center style="color:#ffffff;font-family:sans-serif;font-size:15px;">Reset Password</center>
                            </v:roundrect><![endif]-->
                              <a href='http://${hostname}/Reset-Password/${resetCode}' class="button button--blue linkColorWhite" >Reset Password</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p>If you did not request a password reset, please igonore this email. Password reset is only valid for next 30 minutes .</p>
                      <p>Thanks</p>
                      <!-- Sub copy -->
                      <table class="body-sub">
                        <tr>
                          <td>
                            <p class="sub">If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
                            </p>
                            <p class="sub"><a href='http://${hostname}/Reset-Password/${resetCode}'>'http://${hostname}/Reset-Password/${resetCode}'</a></p>
                          </td>
                        </tr>
              <tr>
                          <td>
                            <p class="sub">This is a auto-generated email, please do not reply to this email.
                            
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

const sendPasswordResetEmail = async (resetCode, name ,email) => {
  try{
    const m =  await  transporter.sendMail({
      from:' rit.regmi@gmail.com',
      to: email ,
      subject:'Reset account password' ,
      html: generatePasswordResetEmail(resetCode,name) })
    return m
  }
  catch(error) {
    console.log(error)
    throw new Error('Verification email could not be sent, please try again')
  }
}


module.exports = { sendPasswordResetEmail }