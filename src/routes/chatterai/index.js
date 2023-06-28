const express = require('express');
const { customError } = require('../../utils');
const { logger } = require('../../utils');
const db = require('../../db');
const Service = require('../../services/DB');

const Router = express.Router();

async function init(req, res, next) {
  const service = new Service('chatterai');

  try {
    const user = await service.users.get({
      columns: [
        'gu.*',
        db.raw(`
          json_agg(
            row_to_json(gc)::jsonb || jsonb_build_object(
              'messages',
              COALESCE((SELECT json_agg(row_to_json(gm)) FROM chatterai__messages AS gm WHERE gm.conversation_id = gc.id), '[]')
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
          'chatterai__user_conversations AS guc',
          'gu.id', 'guc.user_id'
        ],
        [
          'chatterai__conversations AS gc',
          'guc.conversation_id', 'gc.id'
        ],
        [
          'chatterai__messages AS gm',
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

Router
  .get('/init', init)

module.exports = Router;
