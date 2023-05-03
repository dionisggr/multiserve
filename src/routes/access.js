const Service = require('../services/DB');
const db = require('../db');
const { logger } = require('../config');

async function login(req, res) {
  const { id, email, app_id } = req.user;

  logger.info({ id, email }, 'Login successful');

  try {
    const service = new Service(app_id);
    const last_login = db.fn.now();

    await service.users.update({ filters: { id }, data: { last_login } });
  } catch (error) {
    logger.error({ id, error: error.message }, 'Failed to update user last_login.');
  }

  return res.sendStatus(200);
}

async function logout(req, res, next) {
  const { id, email } = req.user;
  
  try {
    await req.logout(async () => {
      await req.session.destroy();
    });

    await res.clearCookie('connect.sid');

    logger.info({ id, email }, 'User logged out successfully');

    return res.sendStatus(200);
  } catch (error) {
    logger.error({ error }, 'Failed to destroy session.');
    
    return next(error);
  }
}

module.exports = { login, logout };
