const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { customError, isBrowserRequest, logger } = require('../utils');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, CHATTERAI_GOOGLE_CLIENT_ID } = require('../config');
const passwords = require('../services/passwords');
const schemas = require('../schemas');
const db = require('../db');

async function login(req, res, next) {
  const { id, username, email, password } = req.body;
  const { app_id } = req.params;

  try {
    const filters = (id)
      ? { id }
      : (username)
        ? { username } : { email };
    
    const user = await db(`${app_id}__users`)
      .where(filters)
      .first();
    
    if (!req.isMFA) {
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
    }

    delete user.password;

    const payload = {
      ...user,
      user_id: user.id,
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
    
    const auth = {
      token: accessToken,
      refreshToken,
      hasOpenAIApiKey: !!user.openai_api_key,

      user: payload,
    };

    return res.json(auth);
  } catch (error) {
    next(error);
  }
}

async function google(req, res, next) {
  const { app_id } = req.params;
  const { credential, organization_id } = req.body;
  const CLIENT_ID = {
    promptwiz: GOOGLE_CLIENT_ID,
    chatterai: CHATTERAI_GOOGLE_CLIENT_ID
  }[app_id]
  const client = new OAuth2Client(CLIENT_ID); 

  try {
    await schemas.google.validateAsync({ credential, app_id });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const {
      given_name: first_name,
      family_name: last_name,
      picture: avatar = null,
      email,
      sub,
    } = ticket.getPayload();
    const organization_ids = [organization_id].filter(Boolean);

    let user = await db(`${app_id}__users`)
      .where({ email })
      .first();
    
    if (!user) {
      const insert = await db(`${app_id}__users`)
        .insert({
          id: sub,
          email,
          first_name,
          last_name,
          avatar,
          is_google: true,
        })
        .returning('*');
      
      user = insert[0];

      organization_ids.push('demo');
    }

    if (organization_ids.length) {
      await db(`${app_id}__user_organizations`)
      .insert(organization_ids.map(id => ({
        user_id: user.id,
        organization_id: id,
      })));
    }

    delete user.password;
    
    const payload = {
      ...user,
      user_id: user.id,
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

    const response = {
      user: payload,
      token: accessToken,
      refreshToken,
      organization_id,
    };

    res.json(response);
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

  const token = jwt.sign(
    payload, JWT_ACCESS_SECRET, { expiresIn: '1h' }
  );

  res.json({ token });
}

async function logout(req, res, next) {
  try {
    const token = req.get('Authorization')?.split(' ')[1];
    const { user_id, app_id } = jwt.verify(token, JWT_ACCESS_SECRET);

    await db(`${app_id}__refresh_tokens`)
      .where({ user_id, token })
      .del();
  
    logger.info({ user_id, app_id }, 'Logout successful');
  
    res.json({ message: 'Logout successful' })
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
    const auth = jwt.verify(token, JWT_ACCESS_SECRET);

    res.json(auth);
  } catch (error) {
    next(error);
  }
}

module.exports = { login, google, reauthorize, logout, check };
