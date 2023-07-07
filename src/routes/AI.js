const express = require('express');
const fetch = require('node-fetch');
const { customError, logger } = require('../utils');
const schemas = require('../schemas');
const db = require('../db')
const Service = require('../services/AI');

const Router = express.Router()
  .post('/chatgpt', chatgpt)
  .post('/dalle', dalle)
  .post('/whisper', whisper);

async function chatgpt(req, res, next) {
  try {
    const {
      conversation_id,
      prompt,
      ...adjustments
    } = req.body;
    const { user_id, app_id, openai_api_key } = req.auth;
    const isStream = req.query.stream?.toLowerCase() === 'true';
    const response = {};

    if (conversation_id) {
      await schemas.conversations.existing.validateAsync(
        { conversation_id, user_id, app_id }
      );

      const history = await db(`${app_id}__messages`)
        .where({ conversation_id, app_id })
        .orderBy('created_at', 'asc');
      const message = await db(`${app_id}__messages`)
        .insert({ content: prompt, conversation_id, user_id })
        .returning('*')[0];
      
      Object.assign(adjustments, { conversation_id, history });
      Object.assign(response, { message });
    }
  
    Object.assign(adjustments, { openai_api_key, stream: isStream });

    const AI = new Service(adjustments);
    const result = await AI.chatgpt(prompt);

    if (conversation_id) {
      await db(`${app_id}__messages`)
        .insert({ content: result, conversation_id, user_id })
        .returning('*');
    }
    
    if (isStream) {
      res.sendStatus(202);
    } else {
      res.json(result);
    }

    return result;
  } catch (error) {
    next(error);
  }
}

async function dalle(req, res, next) {
  const { user_id } = req.auth;
  const { prompt, ...adjustments } = req.body;
  const { amount } = adjustments;
  
  try {
    const AI = new Service.AI(adjustments);
    const images = await AI.dalle(prompt);

    logger.info({ user_id }, 'DALL-E prompted.');

    if (amount && amount > 1) {
      return res.json(images);
    } else {
      return res.json(images[0]);
    }
  } catch (error) {
    next(error);
  }
};

async function whisper(req, res, next) {
  const { user_id } = req.auth;
  const { url = req.params.url, ...adjustments } = req.body;

  try {
    const download = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // What f token?
      },
    });

    if (!download.ok) {
      return next(customError('Failed to download audio.', 400));
    }
    
    const AI = new Service.AI(adjustments);
    const transcript = await AI.whisper(download.body);

    logger.info({ user_id }, 'Whisper prompted.');

    res.json({ transcript })
  } catch (error) {
    next(error);
  }
};

module.exports = { Router, chatgpt };
