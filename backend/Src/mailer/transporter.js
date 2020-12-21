const nodemailer = require('nodemailer')

const transporter =  nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amritnirupa@gmail.com', // generated ethereal user
    pass: 'artvcnuuowxrmlfs' // generated ethereal password
  }
})


module.exports = transporter