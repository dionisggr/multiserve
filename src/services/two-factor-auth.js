const nodemailer = require('nodemailer');
const uuid = require('uuid');
const { ADMIN_PASSWORD, logger } = require('../config');
const { customError } = require('../utils');

function send({ email, app_id, req }) {
  const code = uuid.v4().substring(0, 6);
  const appName = app_id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  const config = {
    subject: `Your One-Time Code for ${appName}`,
    text: `Your one-time code is: ${code}`,
    from: 'tec3org@gmail.com',
    to: email,
  };

  // Email sender
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tec3org@gmail.com',
      pass: ADMIN_PASSWORD + '!',
    }
  });

  transporter.sendMail(config, (error, info) => {
    if (error) {
      logger.info(error, 'Error');
    } else {
      req.session.twoFactorAuth = { email, app_id, code };

      logger.info(info.response, 'Email sent.');
    }
  });
}

function validate({ session, input }) {
  for (field in session) {
    if (session[field] !== input[field]) {
      throw customError('Invalid token', 401);
    }
  }
  
  res.sendStatus(200);
}

module.exports = { send, validate };
