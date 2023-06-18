const jwt = require('jsonwebtoken');
const db = require('../db');
const { customError, isBrowserRequest, logger } = require('../utils');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../config');
const passwords = require('../services/passwords');

async function login(req, res, next) {
  const { username, email, password } = req.body;
  const { app_id } = req.params;

  try {
    const user = await db(`${app_id}__users`)
      .where((username) ? { username } : { email })
      .first();
    const match = user && await passwords.validate({
      server: user.password,
      client: (isBrowserRequest(req))
        ? password
        : passwords.encrypt(password),
    });

    if (!match) {
      return next(
        customError('Missing or invalid credentials.', 401)
      )
    }

    const payload = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      organization_id: user.organization_id,
      app_id,
    }
    const accessToken = jwt.sign(
      payload, JWT_ACCESS_SECRET, { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }
    );

    await db(`${app_id}__refresh_tokens`)
      .insert({ user_id: user.id, token: refreshToken });

    logger.info(payload, 'Login successful');
    
    delete user.password;
    
    return res.json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

async function reauthorize(req, res, next) {
  const refreshToken = req.get('Authorization')?.split(' ')[1];

  if (!refreshToken) {
    return next(customError('Missing refresh token.', 401));
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    const { user_id, app_id } = jwt.decode(refreshToken) || {};

    if (user_id && app_id) {
      await db(`${app_id}__refresh_tokens`)
      .where({ user_id, token: refreshToken })
      .del();
    }

    return next(customError('Invalid refresh token.', 401));
  }
  
  const { user_id, app_id } = payload;
  const authorization = await db(`${app_id}__refresh_tokens`)
    .where({ user_id, token: refreshToken })
    .first();

  if (!authorization) {
    return next(customError('Invalid refresh token.', 401));
  }

  delete payload.iat;
  delete payload.exp;

  const accessToken = jwt.sign(
    payload, JWT_ACCESS_SECRET, { expiresIn: '1h' }
  );

  res.json({ accessToken });
}

async function logout(req, res, next) {
  try {
    const token = req.get('Authorization')?.split(' ')[1];
    const { user_id, app_id } = jwt.verify(token, JWT_ACCESS_SECRET);

    await db(`${app_id}__refresh_tokens`)
      .where({ user_id, token })
      .del();
  
    logger.info({ user_id, app_id }, 'Logout successful');
  
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function check(req, res, next) {
  const token = req.get('Authorization')?.split(' ')[1];

  if (!token) {
    return next(customError('Missing access token.', 401));
  }

  try {
    jwt.verify(token, JWT_ACCESS_SECRET);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

module.exports = { login, reauthorize, logout, check };
