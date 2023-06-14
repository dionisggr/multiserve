const express = require('express');
const Service = require('../../services/AI');
const { logger } = require('../../utils');
const instructions = require('./instructions');

const Router = express.Router();

async function enhance(req, res, next) {
  const { format } = req.params;
  const { prompt = req.params.prompt, ...adjustments } = req.body;
  
  try {
    const AI = new Service(adjustments);
    const instruction = instructions[format];
    const enhanced = await AI.gpt(instruction + prompt);

    logger.info({ user_id: req.user.id }, 'PromptWiz prompted.');

    res.json({ prompt: enhanced });
  } catch (error) {
    next(error);
  }
}

Router
  .post('/:format/:prompt?', enhance)

module.exports = Router;
