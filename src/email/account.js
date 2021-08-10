const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: process.env.SENDER_EMAIL, // Change to your verified sender
            subject: 'Thanks for joining in!',
            text: `Welcome to the app, ${name}. Let us know how you get along with the app.`,
        });
    } catch (e) {
        console.log('Error in sending email : ', e.message);
    }
};

const sendCancelationEmail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: process.env.SENDER_EMAIL, // Change to your verified sender
            subject: 'Sorry to see you go!',
            text: `Goodbye, ${name}. We hope to see you back sometime soon.`,
        });
    } catch (e) {
        console.log('Error in sending email : ', e.message);
    }
};

module.exports = {sendWelcomeMail, sendCancelationEmail};
