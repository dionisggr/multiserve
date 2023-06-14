const Service = require('../../services/DB');
const fetch = require('node-fetch');
const layouts = require('./layouts');
const { customError } = require('../../utils');
const passwords = require('../../services/passwords');
const { logger } = require('../../utils');
const { SLACK_GPTEAMS_DM_TOKEN } = require('../../config');

async function init(req, res, next) {
  try {
    const {
      user: { id: slack_user_id },
      actions,
      trigger_id,
      view,
    } = JSON.parse(req.body.payload);
    const openai_api_key = view.state?.values?.api_key_input?.api_key?.value || null;
    const { action_id } = actions?.[0] || {};
    const service = new Service('gpteams');

    if (!actions && openai_api_key) {
      res.json({ response_action: 'clear' })

      return await register({ slack_user_id, openai_api_key });
    }

    const existing = await service.users.get({ filters: { slack_user_id } });

    if (action_id === 'openai_api_key_modal') {
      if (existing.openai_api_key) {
        const body = {
          user_id: slack_user_id,
          view: {
            type: 'home',
            blocks: layouts.registered,
          },
        };

        res.sendStatus(200);

        return await sendToSlack({ body });
      }

      await modal({ trigger_id, view: layouts.key, user_id: slack_user_id });

      return res.sendStatus(200);
    }

    if (!existing) {
      await service.users.create({ data: { slack_user_id} });

      return await welcome(slack_user_id);
    }

    if (action_id === 'clear_api_key') {
      await unregister(slack_user_id);
    } else if (req.body.event?.type === 'app_uninstall') {
      await uninstall(slack_user_id);
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error(error, 'Error initializing GPTeams.');

    next(error);
  }
}

async function welcome(slack_user_id) {
  const body = {
    user_id: slack_user_id,
    view: {
      type: 'home',
      blocks: layouts.installed,
    },
  };

  await sendToSlack({ body });

  logger.info({ slack_user_id }, 'User installed GPTeams!');
}

async function register(data) {
  const { slack_user_id, openai_api_key } = data;
  const service = new Service('gpteams');

  if (!openai_api_key) {
    const error = customError('OpenAI API Key is required.', 400);
    logger.error(error)
    
    throw customError(error);
  }

  logger.info(data, 'Registering OpenAI API Key to GPTeams...');

  await service.users.update({
    filters: { slack_user_id },
    data: { openai_api_key },
  });

  const body = {
    user_id: slack_user_id,
    view: {
      type: 'home',
      blocks: layouts.registered,
    },
  };

  await sendToSlack({ body });

  logger.info({ slack_user_id }, 'Registration successful.');
}

async function modal({ trigger_id, view }) {
  await (await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ view, trigger_id }),
  })).json();
}

async function unregister(slack_user_id) {
  const service = new Service('gpteams');

  logger.info({ slack_user_id }, 'Removing OpenAI API Key from GPTeams...');

  await service.users.update({
    filters: { slack_user_id },
    data: { openai_api_key: null },
  });

  logger.info({ slack_user_id }, 'OpenAI API key removed successfully.');

  await welcome(slack_user_id);
}

async function uninstall(slack_user_id) {
  const service = new Service('gpteams');

  logger.info({ slack_user_id }, 'Removing user from GPTeams...');

  await service.users.remove({ filters: { slack_user_id } });

  logger.info({ slack_user_id }, 'User removed successfully.');
}

async function sendToSlack({ body, url }) {
  const endpoint = url || 'https://slack.com/api/views.publish';
  
  await (
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  ).json();
}

module.exports = init;
