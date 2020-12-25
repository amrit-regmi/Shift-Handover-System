const nodemailer = require('nodemailer')
const config = require('../../config')
const mailConfig = config.MAIL_CONFIG
const transporter =  nodemailer.createTransport(mailConfig)
module.exports = transporter