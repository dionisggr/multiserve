const { ADMIN_EMAIL, MAILGUN_API_KEY } = require('../config');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

async function send({ app, email, code }) {
  const mg = mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY,
  });

  const msg = {
    from: ADMIN_EMAIL,
    to: [email],
    subject: `Your One-Time Code for ${app}`,
    text: generateMessage({ app, code }),
    html: generateMessage({ app, code }),
  };

  try {
    const response = await mg.messages.create(
      'sandboxc47204d4127d4cb3873d8b83ebdb5537.mailgun.org',
      msg
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

function generateMessage({ app, code }) {
  return `
  <html>
    <body>
      <p style="font-size:16px;">Dear ${app} User,</p>
      <p style="font-size:16px;">
        We appreciate your efforts to keep your account secure. We have generated a one-time verification code for you.
      </p>
      <p style="font-size:20px; color:red;">
        Your one-time verification code is: <b>${code}</b>
      </p>
      <p style="font-size:16px;">
        Please note that for your security, this code will expire in 5 minutes. If you didn't request this code or it expires before you have a chance to use it, please request a new code through our app.
      </p>
      <p style="font-size:16px;">
        We are committed to providing you with the best service and security. If you have any questions or need further assistance, feel free to contact us.
      </p>
      <p style="font-size:16px;">
        Best Regards,
        <br>
        Tec3 Team
      </p>
    </body>
  </html>
  `;
}


module.exports = { send };
