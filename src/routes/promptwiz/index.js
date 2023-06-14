const express = require('express');
const { customError, logger } = require('../../utils');
const instructions = require('./instructions');
const routes = { AI: require('../AI') };

const Router = express.Router()
  .post('/enhance/:format?', enhance);

async function enhance(req, res, next) {
  const { format = 'paragraph' } = req.params;
  const { prompt } = req.body;

  if (['dalle', 'whisper'].includes(req.query.model.toLowerCase())) {
    return next(customError('Invalid model.', 400));
  }

  req.body.prompt = instructions[format] + prompt;

  logger.info({ user_id: req.user.id }, 'PromptWiz prompted.');
  routes.AI.chatgpt(req, res, next);
}

module.exports = Router;
