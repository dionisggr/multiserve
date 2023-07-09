const express = require('express');
const jwt = require('jsonwebtoken');
const { customError, logger } = require('../../utils');
const { JWT_ACCESS_SECRET } = require('../../config');
const db = require('../../db');
const Service = require('../../services/DB');
const websocket = require('../../services/websocket');

const Router = express.Router()
  .get('/user', getUser)
  .get('/spaces', getSpaces)
  .get('/spaces/:organization_id/users', getUsers)
  .get('/chats/:conversation_id/participants', getParticipants)
  .get('/chats', getChats)
  .get('/chatview', chatview)
  .post('/spaces/:organization_id/join', joinSpace)
  .post('/spaces', createSpace)
  .post('/chats/:conversation_id/join', joinChat)
  .post('/chats/:conversation_id/leave', leaveChat)
  .post('/invites/send', sendUsersInvites)
  .post('/invites/validate', validateInviteToken)
  .patch('/spaces/:organization_id', editSpace)
  .delete('/spaces/:organization_id', deleteSpace)
  .delete('/spaces/:organization_id/users/:user_id', removeUser)
  .delete('/chats/:conversation_id', deleteChat)
  .delete('/chats/:conversation_id/participants/:user_id', removeParticipant)

async function getSpaces(req, res, next) {
  const { id: user_id } = req.auth;

  try {
    const spaces = await db('chatterai__organizations AS o')
      .leftJoin('chatterai__user_organizations AS uo', 'uo.organization_id', 'o.id')
      .where({ user_id });
    
    res.json(spaces);    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function createSpace(req, res, next) {
  const { id: user_id } = req.auth;
  const { name } = req.body;

  try {
    const spaces = await db('chatterai__organizations')
      .insert({ name, created_by: user_id })
      .returning('*');
    
    await db('chatterai__user_organizations')
      .insert({ user_id, organization_id: spaces[0].id });
    
    res.json(spaces[0]);    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function deleteSpace(req, res, next) {
  const { id: user_id } = req.auth;
  const { organization_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__organizations')
      .where({ organization_id, created_by: user_id })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const existing = await db('chatterai__organizations')
      .where({ id: organization_id })
      .first();
    
    await db('chatterai__organizations')
      .where({ id: organization_id, created_by: user_id })
      .del();

    websocket.chatterai.sendMessage({
      action: 'delete_space',
      id: existing.id,
    });
    
    res.json(spaces[0]);    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function joinSpace(req, res, next) {
  const { id: user_id, email } = req.auth;
  const { organization_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__invites')
      .where({ email, organization_id })
      .first();
    
    if (isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    await db('chatterai__user_organizations')
      .insert({ user_id, organization_id });
    
    res.json({ message: 'Joined space' });    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function getChats(req, res, next) {
  const { id: user_id } = req.auth;
  const { space } = req.query;

  try {
    const isAuthorized = await db('chatterai__user_organizations')
      .where({ user_id, organization_id: space })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const chats = await db(`chatterai__conversations AS c`)
      .leftJoin('chatterai__users AS u', 'c.created_by', 'u.id')
      .where({ organization_id: space, type: 'public' })
      .orWhere({ organization_id: space, type: 'private', created_by: user_id })
      .orderBy('updated_at', 'desc')
      .select('c.*', db.raw('COALESCE(u.username, u.first_name, u.email) AS created_by_name'));
    
    res.json(chats);    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function chatview(req, res, next) {
  const { id: user_id } = req.auth;
  const { chat: conversation_id } = req.query;

  try {
    const isAuthorized = await db('chatterai__conversations AS c')
      .leftJoin('chatterai__user_organizations AS uo', 'uo.organization_id', 'c.organization_id')
      .where({ 'id': conversation_id, user_id })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }
    
    const messages = await db('chatterai__messages')
      .where({ conversation_id })
      .orderBy('created_at');
    const participants = await db('chatterai__user_conversations AS uc')
      .leftJoin('chatterai__users AS u', 'u.id', 'uc.user_id')
      .where({ conversation_id });
    
    res.json({ messages, participants });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
};

async function joinChat(req, res, next) {
  const { id: user_id } = req.auth;
  const { conversation_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__conversations AS c')
      .leftJoin('chatterai__user_organizations AS uo', 'uo.organization_id', 'c.organization_id')
      .where({ id: conversation_id, user_id  })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    await db('chatterai__user_conversations')
      .insert({ user_id, conversation_id })
      .returning('*');

    const user = await db('chatterai__users')
      .where({ id: user_id })
      .first();
    
    delete user.password;
    
    websocket.chatterai.sendMessage({
      action: 'join_chat',
      conversation_id,
      user,
    });
    
    res.json(user);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function leaveChat(req, res, next) {
  const { id: user_id } = req.auth;
  const { conversation_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__user_conversations AS uc')
      .where({ conversation_id, user_id })
      .first();
    
    if (!isAuthorized) {
      return next(customError('User not part of chat', 401));
    }

    const existing = await db('chatterai__conversations')
      .where({ id: conversation_id })
      .first();
    
    await db('chatterai__user_conversations')
      .where({ user_id, conversation_id })
      .del();
    
    websocket.chatterai.sendMessage({
      action: 'leave_chat',
      id: existing.id,
      user_id,
    });
    
    res.json({ message: 'User left chat' });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function deleteChat(req, res, next) {
  const { id: user_id } = req.auth;
  const { conversation_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__conversations')
      .where({ id: conversation_id, created_by: user_id });
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const existing = await db('chatterai__conversations')
      .where({ id: conversation_id, created_by: user_id })
      .first();
    
    if (!existing) {
      return next(customError('Chat not found', 404));
    }

    await db('chatterai__conversations')
      .where({ id: conversation_id, created_by: user_id })
      .del();

    websocket.chatterai.sendMessage({
      action: 'delete_chat',
      id: existing.id,
      user_id,
    });
    
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function editSpace(req, res, next) {
  const { id: user_id } = req.auth;
  const { organization_id } = req.params;
  const { name } = req.body;

  try {
    const isAuthorized = await db('chatterai__organizations')
      .where({ id: organization_id, created_by: user_id })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const updated = await db('chatterai__organizations')
      .where({ id: organization_id })
      .update({ name })
      .returning('*');
    
    if (!updated.length) {
      return next(customError('Space not found', 404));
    }

    websocket.chatterai.sendMessage({
      action: 'edit_space',
      space: updated[0],
    });
    
    res.json(updated[0]);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function getUser(req, res, next) {
  const { id: user_id } = req.auth;

  try {
    const user = await db('chatterai__users')
      .where({ id: user_id })
      .first();
    
    res.json(user);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function getParticipants(req, res, next) {
  const { id: user_id } = req.auth;
  const { conversation_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__conversations AS uc')
      .rightJoin('chatterai__user_organizations AS uo', 'uo.organization_id', 'uc.organization_id')
      .where({ id: conversation_id, user_id })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const participants = await db('chatterai__user_conversations AS uc')
      .leftJoin('chatterai__users AS u', 'u.id', 'uc.user_id')
      .where({ conversation_id })
    
    res.json(participants);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}
 
async function removeParticipant(req, res, next) {
  const { id: created_by } = req.auth;
  const { conversation_id, user_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__conversations AS uc')
      .where({ created_by })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const existing = await db('chatterai__user_conversations')
      .where({ conversation_id, user_id })
      .first();
    
    if (!existing) {
      return next(customError('Participant not found', 404));
    }

    await db('chatterai__user_conversations')
      .where({ conversation_id, user_id })
      .del();
    
    websocket.chatterai.sendMessage({
      action: 'remove_participant',
      id: conversation_id,
      user_id,
    });    
    
    res.json({ message: 'Participant removed' });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

// Chat Space
async function getUsers(req, res, next) {
  const { id: created_by } = req.auth;
  const { organization_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__organizations')
      .where({ id: organization_id, created_by })
      .first();
    
    // if (!isAuthorized) {
    //   return next(customError('Unauthorized', 401));
    // }

    const users = await db('chatterai__user_organizations AS uo')
      .leftJoin('chatterai__users AS u', 'u.id', 'uo.user_id')
      .where({ organization_id });
    const filtered = users.map(({ password, ...user }) => user);
    
    res.json(filtered);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

// Chat Space
async function removeUser(req, res, next) {
  const { id: created_by } = req.auth;
  const { organization_id, user_id } = req.params;

  try {
    const isAuthorized = await db('chatterai__organizations')
      .where({ id: organization_id, created_by })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const existing = await db('chatterai__users AS u')
      .leftJoin('chatterai__user_organizations AS uo', 'u.id', 'uo.user_id')
      .where({ organization_id, user_id })
      .first();
    
    if (!existing) {
      return next(customError('User not found in space.', 404));
    }

    const conversation_ids = await db('chatterai__user_conversations AS uc')
      .leftJoin('chatterai__conversations AS c', 'c.id', 'uc.conversation_id')
      .where({ user_id, organization_id })
      .pluck('conversation_id');
    const { first_name, username, email } = existing;
    
    await db('chatterai__messages')
      .insert(conversation_ids.map(conversation_id => ({
        content: `User ${first_name || username || email} has left the chat.`,
        user_id: 'chatterai',
        conversation_id,
      })));

    await db('chatterai__user_conversations')
      .where({ user_id })
      .whereIn('conversation_id', conversation_ids)
      .del();
    
    await db('chatterai__user_organizations')
      .where({ organization_id, user_id })
      .del();
    
    websocket.chatterai.sendMessage({
      action: 'remove_user',
      id: organization_id,
      user_id,
    });    
    
    res.json({ message: 'User removed from space' });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function sendUsersInvites(req, res, next) {
  const { id: sender } = req.auth;
  const { emails, organization_id } = req.body;

  try {
    const isAuthorized = await db('chatterai__organizations')
      .where({ id: organization_id, created_by: sender })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const invites = emails.map(email => ({
      email,
      sender,
      organization_id,
      token: jwt.sign(
        { sender, organization_id },
        JWT_ACCESS_SECRET,
        { expiresIn: '1d' })
    }));

    await db('chatterai__invites')
      .insert(invites);
    
    const service = new Service();
    const data = invites.map(invite => {
      const { email, token } = invite;

      return { email, url: 'https://localhost:3000/space/' + token }
    })
    
    await service.email.sendInvites({
      app: 'Chatter.AI',
      subject: 'You have been invited to join a chat space in Chatter.AI!',
      group: organization_id,
      data
    });
    
    res.json({ message: 'Invites sent' });
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function validateInviteToken(req, res, next) {
  const token = req.get('Authorization')?.split(' ')?.[1];

  try {
    const { sender, organization_id } = jwt.verify(token, JWT_ACCESS_SECRET);
    const exists = await db('chatterai__invites')
      .where({ token, sender, organization_id })
      .first();

    if (!exists) {
      return next(customError('Invalid invite token', 401));
    }

    const space = await db('chatterai__organizations')
      .where({ id: organization_id })
      .first();
    
    res.json(space);
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

module.exports = Router;
