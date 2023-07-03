const express = require('express');
const { customError } = require('../../utils');
const { logger } = require('../../utils');
const db = require('../../db');

const Router = express.Router();
const aiModels = ['chatgpt', 'gpt-4', 'dall-e', 'whisper'];

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
    const spaces = await db('chatterai__organizations')
      .where({ id: organization_id, created_by: user_id })
      .delete();
    
    if (!spaces) {
      return next(customError('Unauthorized', 401));
    }
    
    res.json(spaces[0]);    
  } catch (err) {
    logger.error(err);
    next(customError(err.message, 500));
  }
}

async function getChats(req, res, next) {
  const { id: user_id } = req.auth;
  const { space } = req.query;

  try {
    const chats = await db(`chatterai__conversations AS c`)
      .leftJoin('chatterai__user_organizations AS uo', 'uo.organization_id', 'c.organization_id')
      .where({ user_id, 'c.organization_id': space, type: 'public' })
      .orWhere({ created_by: user_id, 'c.organization_id': space, type: 'private' })      
    
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
      .where({ conversation_id });
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
      .where({ id: conversation_id, user_id, type: 'public'  })
      .first();
    
    if (!isAuthorized) {
      return next(customError('Unauthorized', 401));
    }

    const result = await db('chatterai__user_conversations')
      .insert({ user_id, conversation_id })
      .returning('*')
    
    res.json(result);
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

    await db('chatterai__user_conversations')
      .where({ user_id, conversation_id })
      .del()
    
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
    const deleted = await db('chatterai__conversations')
      .where({ id: conversation_id, created_by: user_id })
      .del()
    
    if (!deleted) {
      return next(customError('Chat not found', 404));
    }
    
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
      .returning('*')
    
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

Router
  .get('/user', getUser)
  .get('/spaces', getSpaces)
  .get('/chats', getChats)
  .get('/chatview', chatview)
  .post('/spaces', createSpace)
  .post('/chats/:conversation_id/join', joinChat)
  .post('/chats/:conversation_id/leave', leaveChat)
  .patch('/spaces/:organization_id', editSpace)
  .delete('/spaces/:organization_id', deleteSpace)
  .delete('/chats/:conversation_id', deleteChat)

module.exports = Router;
