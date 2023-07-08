const express = require('express');
const { customError, logger } = require('../../utils');
const { PROMPTWIZ_OPENAI_API_KEY } = require('../../config');
const instructions = require('./instructions');
const db = require('../../db');
const { P } = require('pino');
const routes = { ChatGPT: require('../AI').chatgpt };

const Router = express.Router()
  .get('/prompts', getPrompts)
  .post('/prompts', createPrompt)
  .post('/enhance/:format?', enhance)
  .patch('/prompts/:id', title)
  .delete('/prompts/:id', remove);

async function enhance(req, res, next) {
  const { user_id } = req.auth;
  const { format = 'paragraph' } = req.params;
  const { model = 'chatgpt' } = req.query;
  const { prompt } = req.body;

  if (!model.toLowerCase().includes('chatgpt')) {
    return next(customError('Invalid model.', 400));
  }

  try {
    req.body.prompt = instructions[format] + prompt;

    if (!req.auth.openai_api_key) {
      req.auth.openai_api_key = PROMPTWIZ_OPENAI_API_KEY;
    }

    logger.info({ user_id }, 'PromptWiz prompted.');
    
    await routes.ChatGPT(req, res, next);
  } catch (error) {
    next(error);
  }
}

async function getPrompts(req, res, next) {
  try {
    const promptList = await db('promptwiz__prompts')
      .where({ 'user_id': req.auth.user_id })
      .orderBy('updated_at', 'desc');
  
    logger.info({ user_id: req.auth.user_id }, 'PromptWiz prompts retrieved.');

    res.json(promptList);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  const { user_id } = req.auth;
  const { id } = req.params;

  try {
    await db('promptwiz__prompts')
      .where({ id, user_id })
      .del();

    logger.info({ user_id }, 'PromptWiz prompt deleted.');

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function createPrompt(req, res, next) {
  const { user_id } = req.auth;
  const {
    prompt,
    title = 'New prompt',
    model = 'chatgpt',
  } = req.body;

  try {
    const [id] = await db('promptwiz__prompts')
      .insert({ prompt, title, model, user_id })
      .returning('id');

    logger.info({ user_id }, 'PromptWiz prompt created.');

    res.json({ id });
  } catch (error) {
    next(error);
  }
}

async function title(req, res, next) {
  const { user_id } = req.auth;
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updated = await db('promptwiz__prompts')
      .update({ title })
      .where({ id, user_id, updated_at: db.fn.now() })
      .returning('*');
    
    if (!updated || !updated.length) {
      return next(customError('Prompt not found.', 404));
    }

    logger.info({ user_id }, 'PromptWiz prompt updated.');

    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = Router;
