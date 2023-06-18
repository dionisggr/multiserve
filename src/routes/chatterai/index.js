const express = require('express');
const { customError } = require('../../utils');
const { logger } = require('../../utils');
const db = require('../../db');
const Service = require('../../services/DB');

const Router = express.Router();

async function init(req, res, next) {
  const service = new Service('groupgpt');

  try {
    const user = await service.users.get({
      columns: [
        'gu.*',
        db.raw(`
          json_agg(
            row_to_json(gc)::jsonb || jsonb_build_object(
              'messages',
              COALESCE((SELECT json_agg(row_to_json(gm)) FROM groupgpt__messages AS gm WHERE gm.conversation_id = gc.id), '[]')
            )
          ) AS conversations`
        ),
      ],
      filters: {
        'gu.id': req.user.id,
        'gm.archived_by': null,
      },
      leftJoins: [
        [
          'groupgpt__user_conversations AS guc',
          'gu.id', 'guc.user_id'
        ],
        [
          'groupgpt__conversations AS gc',
          'guc.conversation_id', 'gc.id'
        ],
        [
          'groupgpt__messages AS gm',
          'gm.conversation_id', 'guc.conversation_id'
        ]
      ],
      groupBy: ['gu.id'],
      orderBy: ['gc.created_at DESC'],
    });

    if (!user) {
      return next(customError('No conversations found.', 404));
    }

    res.json(user);
  } catch (error) {
    logger.error(error);

    return next(customError('Internal server error.', 500));
  }
}

async function validate(req, res, next) {
  if (!req.user.is_admin && req.user.app_id !== 'groupgpt') {
    return next(
      customError(`Unauthorized request from ${req.user.id}.`, 400)
    );
  }
}

Router
  .all(validate)
  .get('/init', init)

module.exports = Router;
