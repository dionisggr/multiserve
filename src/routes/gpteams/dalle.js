const fetch = require('node-fetch');
const { customError } = require('../../utils');
const {
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
} = require('../../config');
const { logger } = require('../../utils');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};

async function dalle(req, res, next) {
  res.header('X-Slack-No-Retry', 1);

  const { challenge } = req.body;

  if (challenge) {
    return res.json(challenge);
  }

  const {
    text,
    trigger_id,
    command,
    channel_id: channel,
    user_id: slack_user_id,
  } = req.body;

  if (!slack_user_id || slack_user_id === SLACK_GPTEAMS_BOT_ID) {
    return res.sendStatus(400);
  }

  try {
    const DB = new Service.DB('gpteams');
    const user = await DB.users.get({ filters: { slack_user_id } });

    if (!user) {
      return next(customError('User not found.', 404));
    }

    const { ts: new_ts } = await (
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
        },
        body: JSON.stringify({
          channel,
          blocks: [
            { type: 'divider' },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `DALLE: _${text}_`,
              },
            },
            { type: 'divider' },
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'Thinking...',
              },
            },
          ],
        }),
      })
    ).json();

    let conversation = await DB.conversations.get({
      filters: {
        slack_ts: trigger_id,
        slack_channel: channel,
      },
    });

    if (conversation) {
      logger.info({ conversation_id: conversation.id }, 'Conversation found.');

      res.end();

      const messages =
        (
          await DB.messages.get({
            filters: { conversation_id: conversation.id, archived_by: null },
            orderBy: ['created_at', 'desc'],
            multiple: true,
          })
        ).map((msg) => {
          const { content, user_id } = msg;
          const role = user_id === 'gpt' ? 'assistant' : 'user';

          return { role, content };
        }) || [];

      logger.info(
        { [conversation.id]: messages.length, trigger_id },
        'Messages in conversation.'
      );
    } else {
      conversation = await DB.conversations.create({
        data: {
          title: 'GPTeams Conversation',
          created_by: user.id,
          type: channel === SLACK_GPTEAMS_BOT_CHANNEL ? 'single' : 'group',
          slack_ts: trigger_id,
          slack_channel: channel,
        },
      });

      logger.info(
        { conversation_id: conversation.id, trigger_id },
        'Conversation created.'
      );

      res.end();

      const { user_id, content } = await DB.messages.create({
        data: {
          content: text,
          conversation_id: conversation.id,
          user_id: user.id,
        },
      });
      const role = user_id === 'gpt' ? 'assistant' : 'user';
      const message = { role, content };
    }

    const AI = new Service.AI({
      openai_api_key: user.openai_api_key,
      conversation_id: conversation.id
    });
    const response = await AI[command.slice(1)](text);

    logger.info(
      { slack_user_id },
      `Slack ${command.slice(1).toUpperCase()} Prompted.`
    );

    const blocks = [
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `DALLE: _${text}_`,
        },
      },
      {
        type: 'image',
        image_url: response,
        alt_text: text,
      },
    ];
    const body = new_ts
      ? {
          ts: new_ts,
          channel,
          blocks,
        }
      : {
          channel: slack_user_id,
          blocks,
        };

    await fetch('https://slack.com/api/chat.update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    await DB.messages.create({
      data: {
        content: response,
        conversation_id: conversation.id,
        user_id: 'gpt',
      },
    });
  } catch (error) {
    logger.error(error, 'Error prompting from Slack.');
  }
}

module.exports = dalle;
