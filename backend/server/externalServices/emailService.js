"use strict";

const sendEmail = (options) => {
    const mailOptions = {
        from: EMAIL,
        to: options.userIds || [],
        subject: options.subject || "Service status update",
        text: options.message || ''
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('ERROR ::: inside emailService in sendMail, failed to sent email with err: ', error);
        } else {
            console.log('SUCCESS ::: inside emailService in sendMail, succeed to send email with message: ', info.response);
        }
    });
};

module.exports = sendEmail;
