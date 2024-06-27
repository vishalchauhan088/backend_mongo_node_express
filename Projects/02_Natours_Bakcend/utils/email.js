const nodemailer = require('nodemailer');

const sendEmail = async(option) =>{

    // 1) create a transporter

    // const transporter = nodemailer.createTransport({
    //     service:'Gmail',
    //     auth:{
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }

    //     // activate 'less secure app in gmail' to send email using gmail
    // })

    // we need to define hostname and service because nodemailer doesn't comes with mailtrap 
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) define the email option

    const emailOptions = {

        from:'vishal@Natours.com',
        to:option.email,
    
        subject:option.subject,
        text: option.message
    }

    // 3) actually send the email

    await transporter.sendMail(emailOptions)
}

module.exports = sendEmail;