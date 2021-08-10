const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');
const msg = {
    to: 'ArunKumar.Bahal@toshiba-tsip.com', // Change to your recipient
    from: 'a24ren@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent');
    })
    .catch((error) => {
        console.error(error);
    });
