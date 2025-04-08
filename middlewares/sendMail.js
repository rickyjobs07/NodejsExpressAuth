const nodeMailer = require('nodemailer');

const transport = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.NODE_SENDING_EMAIL,
        pass: process.env.NODE_SENDING_PASSWORD
    },
})

module.exports = transport;