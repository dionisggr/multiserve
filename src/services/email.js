const { ADMIN_EMAIL, SENDGRID_API_KEY } = require('../config');
const { logger } = require('../utils');

async function send({ app, email, code }) {
  const sendgrid = require('@sendgrid/mail');

  sendgrid.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: ADMIN_EMAIL,
    subject: `Your One-Time Code for ${app}`,
    text: generateMessage({ app, code }),
  };
  const response = (await sendgrid.send(msg))[0];
  const log = { app, email, code, status: response.statusCode };

  logger.info(log, 'Message sent: %s');

  return response;
};

function generateMessage({ app, code }) {
  return `Dear ${app} User,

We appreciate your efforts to keep your account secure. We have generated a one-time verification code for you.

Your one-time verification code is: ${code}

Please note that for your security, this code will expire in 5 minutes. If you didn't request this code or it expires before you have a chance to use it, please request a new code through our app.

We are committed to providing you with the best service and security. If you have any questions or need further assistance, feel free to contact us.

Best Regards,
Tec3 Team`;
};

module.exports = { send };
