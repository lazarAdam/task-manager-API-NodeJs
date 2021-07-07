const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'elaallalios@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how like the app.`


    })
}


const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'elaallalios@gmail.com',
        subject: 'sorry for leaving us!',
        text: `sorry to hear that you chose drop your account, ${name}. Let us know  what can be done to improve the service.`


    })
}

module.exports = {
    sendWelcomeEmail:sendWelcomeEmail,
    sendCancelEmailL:sendCancelEmail
}