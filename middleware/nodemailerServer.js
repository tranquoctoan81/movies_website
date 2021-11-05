const nodemailer = require('nodemailer');
function sendCustomEmail(emailTo, subject, text) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "trantoan150801@gmail.com",
            pass: "fstkvwonqscpjqpz",
        },
    });
    let message = {
        from: "Phimmoicuatui",
        to: emailTo,
        subject: subject,
        text: text,

    }
    transporter
        .sendMail(message)
        .then((res) => {
            console.log("email send successfull")
        })
        .catch((err) => {
            console.log(err)
        });

}
module.exports = {
    sendCustomEmail
};