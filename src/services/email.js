const { ADMIN_EMAIL, MAILGUN_API_KEY } = require('../config');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

async function sendMFA({ app, email, code }) {
  const subject = `Your One-Time Code for ${app}`;
  const content = generateMFAEmail({ app, code });
  
  await send({ subject, content, email });
};

async function sendInvites({ app, subject, group, data }) {
  for (let i = 0; i < data.length; i++) {
    const { email } = data[i];
    const content = generateInviteEmail({ app, group, ...data[i] });

    await send({ subject, content, email });
  }
};

async function send({ subject, content, email, emails }) {
  const mg = mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY,
  });

  const msg = {
    from: ADMIN_EMAIL,
    to: emails || [email],
    subject,
    text: content,
    html: content,
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

function generateMFAEmail({ app, code }) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333333; margin: 0; padding: 0;">
        <div style="padding: 20px;">
          <p style="font-size: 18px;">Dear ${app} User,</p>
          <p style="font-size: 18px;">
            We appreciate your efforts to keep your account secure. We have generated a one-time verification code for you.
          </p>
          <p style="font-size: 24px; color: #ff0000;">
            Your one-time verification code is: <b>${code}</b>
          </p>
          <p style="font-size: 18px;">
            Please note that for your security, this code will expire in 5 minutes. If you didn't request this code or it expires before you have a chance to use it, please request a new code through our app.
          </p>
          <p style="font-size: 18px;">
            We are committed to providing you with the best service and security. If you have any questions or need further assistance, feel free to contact us.
          </p>
          <p style="font-size: 18px;">
            Best Regards,
            <br>
            Your Team
          </p>
        </div>
      </body>
    </html>
  `;
};


function generateInviteEmail({ app, group, url }) {
  return `
  <html>
      <body style="font-family: Arial, sans-serif; color: #333333; margin: 0; padding: 0;">
        <div style="padding: 20px;">
          <p style="font-size: 18px;">Hello,</p>
          <p style="font-size: 18px;">
            You have been invited to join ${group ? 'from ' + app : app}! To get started, please click the link below.
          </p>
          <p style="font-size: 18px;">
            <a href="${url}" style="color: #337ab7; text-decoration: none;">Join ${app}</a>
          </p>
          <p style="font-size: 18px;">
            If you have any questions or need assistance, please feel free to contact me!
          </p>
          <p style="font-size: 18px;">
            Best Regards,
            <br>
            @dioveloper
          </p>
        </div>
      </body>
    </html>
    `
};


module.exports = { sendMFA, sendInvites };
