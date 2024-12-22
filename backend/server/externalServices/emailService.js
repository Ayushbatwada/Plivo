"use strict";
const sanityChecks = require("../../utils/sanityChecks");

module.exports = {
    sendEmail: (options) => {
        if (!sanityChecks.isValidString(options.userEmails)) {
            return console.log('Info ::: missing info emailService inside sendMail, userIds: ', options.userEmails)
        }
        const mailOptions = {
            from: `Communication ${EMAIL}`,
            to: options.userEmails || [],
            subject: options.subject || "Service status update",
            html: `<p style="font-size: 14px">${options.message}</p>`
        };

        emailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('ERROR ::: inside emailService in sendMail, failed to sent email with err: ', error);
            } else {
                console.log('SUCCESS ::: inside emailService in sendMail, succeed to send email with message: ', info.response);
            }
        });
    }
}
