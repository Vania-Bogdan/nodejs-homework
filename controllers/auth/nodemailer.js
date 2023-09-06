const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

function sendEmail(message) {
    message["from"] = process.env.MAILTRAP_EMAIL_FROM

    return transport.sendMail(message)
}

module.exports = sendEmail