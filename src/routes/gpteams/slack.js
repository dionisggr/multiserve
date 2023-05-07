const express = require('express');
const fetch = require('node-fetch');
const { customError } = require('../../utils');
const {
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  logger,
} = require('../../config');
const cache = require('../../services/cache');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};

const Router = express.Router();

async function prompt(req, res, next) {
  res.header('X-Slack-No-Retry', 1);

  const { challenge } = req.body;

  if (challenge) {
    return res.json(challenge);
  }

  const {
    user: slack_user_id = null,
    text = null,
    subtype,
    channel,
    ts,
    thread_ts = ts,
  } = req.body.event;
  const { is_bot } = req.body.authorizations;

  if (subtype === 'bot_add') {
    return res.sendStatus(200);
  }

  if (!slack_user_id || slack_user_id === SLACK_GPTEAMS_BOT_ID) {
    return res.sendStatus(400);
  }

  try {
    const DB = new Service.DB('gpteams');
    const user = await DB.users.get({ filters: { slack_user_id } });

    if (!user) {
      return next(customError('User not found.', 404));
    }

    let conversation = await DB.conversations.get({
      filters: {
        slack_ts: thread_ts,
        slack_channel: channel,
      },
    });

    if (conversation) {
      logger.info({ conversation_id: conversation.id }, 'Conversation found.');

      res.sendStatus(202); // Accepted + Processing

      if (conversation.id in cache.data) {
        cache.data[conversation.id].messages.push({
          role: 'user',
          content: text,
        });
      } else {
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
          { [conversation.id]: messages.length, thread_ts },
          'Messages in conversation.'
        );

        cache.upsert(conversation.id, { messages });
      }
    } else {
      conversation = await DB.conversations.create({
        data: {
          title: 'GPTeams Conversation',
          created_by: user.id,
          type: is_bot ? 'single' : 'group',
          slack_ts: thread_ts,
          slack_channel: channel,
        },
      });

      logger.info(
        { conversation_id: conversation.id, thread_ts },
        'Conversation created.'
      );

      res.sendStatus(202); // Accepted + Processing

      const { user_id, content } = await DB.messages.create({
        data: {
          content: text,
          conversation_id: conversation.id,
          user_id: user.id,
        },
      });
      const role = user_id === 'gpt' ? 'assistant' : 'user';
      const message = { role, content };
      const messages = [message];

      cache.upsert(conversation.id, { messages });
    }

    const AI = new Service.AI({ conversation_id: conversation.id });
    const { ts: new_ts } = await (await fetch(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
        },
        body: JSON.stringify({
          text: 'Thinking...',
          channel,
          thread_ts,
        }),
      }
    )).json();

    const response = await AI.chatgpt(text);

    logger.info({ slack_user_id }, 'Slack ChatGPT Prompted.');

    let responseText = '';

    response.data.on('data', async (data) => {
      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '');
      
      for (const line of lines) {
        const message = line.replace(/^data: /, '');

        if (message === '[DONE]') {
          return; // Stream finished
        }

        try {
          const parsed = JSON.parse(message);

          responseText += parsed.choices[0].delta.content;

          await fetch('https://slack.com/api/chat.update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
            },
            body: JSON.stringify({
              text: responseText,
              channel,
              ts: new_ts,
            }),
          });
        } catch (error) {
          // Ignore
        }
      }
    });

    await DB.messages.create({
      data: {
        content: responseText,
        conversation_id: conversation.id,
        user_id: 'gpt',
      },
    });
  } catch (error) {
    logger.error(error, 'Error: Could not prompt ChatGPT from Slack.');

    next(error);
  }
}

Router.post('/', prompt);

module.exports = Router;
