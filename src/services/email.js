const { ADMIN_EMAIL, SENDGRID_API_KEY } = require('../config');
const { logger } = require('../utils');

async function send({ app, email, code }) {
  const sendgrid = require('@sendgrid/mail');

  sendgrid.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: ADMIN_EMAIL,
    subject: `Your One-Time Code for ${app}`,
    text: `Hello from ${app}!\n\nYour one-time code is: ${code}\n\nIt expires in 5 minutes!\n\nBest regards,\nTec3 team`,
  };
  const response = (await sendgrid.send(msg))[0];
  const log = { app, email, code, status: response.statusCode };

  logger.info(log, 'Message sent: %s');

  return response;
};

module.exports = { send };
