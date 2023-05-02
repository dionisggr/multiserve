const { customError } = require('../utils');
const express = require('express');
const { logger } = require('../config');
const db = require('../db');
const Service = require('../services');

const Router = express.Router();

async function init(req, res, next) {
  const service = new Service('gpt');

  try {
    const conversations = await service.users.get({
      columns: [
        'gu.*',
        db.raw(`
          json_agg(
            row_to_json(gc)::jsonb || jsonb_build_object(
              'messages',
              COALESCE((SELECT json_agg(row_to_json(gm)) FROM gpt__messages AS gm WHERE gm.conversation_id = gc.id), '[]')
            )
          ) AS conversations`
        ),
      ],
      filters: { 'gu.id': req.user.id },
      leftJoins: [
        [
          'gpt__user_conversations AS guc',
          'gu.id', 'guc.user_id'
        ],
        [
          'gpt__conversations AS gc',
          'guc.conversation_id', 'gc.id'
        ],
        [
          'gpt__messages AS gm',
          'gm.conversation_id', 'guc.conversation_id'
        ]
      ],
      groupBy: ['gu.id'],
      orderBy: ['gc.updated_at DESC'],
      multiple: true,
    });

    if (!conversations || !conversations.length) {
      return next(customError('No conversations found.', 404));
    }

    res.json(conversations);
  } catch (error) {
    logger.error(error);

    return next(customError('Internal server error.', 500));
  }
}

async function validate(req, res, next) {
  if (!req.user.is_admin && req.user.app_id !== 'gpt') {
    return next(
      customError(`Unauthorized request from ${req.user.id}.`, 400)
    );
  }
}

Router
  .all(validate)
  .get('/init', init)

module.exports = Router;
