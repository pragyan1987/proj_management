var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pragyan87.das@gmail.com',
    pass: 'shrihaan2014'
  }
});

module.exports = nodemailer;