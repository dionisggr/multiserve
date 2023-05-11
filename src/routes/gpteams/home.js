const Service = require('../../services/DB');
const blocks = require('./blocks');
const { logger } = require('../../config');

async function init(req, res, next) {
  res.sendStatus(200);

  try {
    const { user: slack_user_id } = req.body.event; // Fix this
    const service = new Service('gpteams');
    const registered = await service.keys.get({ filters: { slack_user_id } });

    if (!registered) {
      await service.users.create({ data: { slack_user_id } });
      await service.keys.create({ data: { slack_user_id } });

      return await welcome(slack_user_id);
    }

    const { action_id, value: openai_api_key } = req.body.payload?.actions[0];

    if (action_id === 'register') {
      return await register({ slack_user_id, openai_api_key });
    } else if (action_id === 'unregister') {
      return await unregister(slack_user_id);
    }
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
      blocks: blocks.installed,
    },
  };

  await sendToSlack(body);

  logger.info({ slack_user_id }, 'User installed GPTeams!');
}

async function register({ slack_user_id, openai_api_key }) {
  try {
    const service = new Service('gpteams');

    logger.info(data, 'Registering OpenAI API Key to GPTeams...');

    await service.keys.update({
      filters: { slack_user_id },
      data: { openai_api_key },
    });

    const body = {
      user_id: slack_user_id,
      view: {
        type: 'home',
        blocks: blocks.registered,
      },
    };

    await sendToSlack(body);

    logger.info({ userId }, 'Registration successful.');
  } catch (error) {
    logger.error(error, 'Error registering user.');

    next(error);
  }
}

async function unregister({ slack_user_id }) {
  const service = new Service('gpteams');

  logger.info({ slack_user_id }, 'Removing OpenAI API Key from GPTeams...');

  try {
    await service.keys.remove({ filters: { slack_user_id } });

    logger.info({ slack_user_id }, 'OpenAI API key removed successfully.');

    await welcome(slack_user_id);
  } catch (error) {
    logger.error(error, 'Error registering user.');

    next(error);
  }
}

async function uninstall(slack_user_id) {
  const service = new Service('gpteams');

  logger.info({ slack_user_id }, 'Removing user from GPTeams...');

  try {
    await service.users.remove({ filters: { slack_user_id } });

    const body = {
      user_id: slack_user_id,
      view: {
        type: 'home',
        blocks: blocks.installed,
      },
    };

    logger.info({ slack_user_id }, 'User removed successfully.');

    res.sendStatus(200);
  } catch (error) {
    logger.error(error, 'Error registering user.');

    next(error);
  }
}

async function sendToSlack(body) {
  await fetch('https://slack.com/api/views.publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

module.exports = { init, uninstall };
