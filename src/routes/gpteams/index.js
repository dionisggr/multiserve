const express = require('express');
const fetch = require('node-fetch');
const { customError } = require('../../utils');
const {
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
  logger,
} = require('../../config');
const cache = require('../../services/cache');
const db = require('../../db');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};

const Router = express.Router()
  
async function prompt(req, res, next) {
  res.header('X-Slack-No-Retry', 1);

  const { challenge } = req.body;

  if (challenge) {
    return res.json(challenge);
  }

  const {
    user: slack_user_id,
    text = null,
    ts,
    thread_ts = ts,
  } = req.body.event.message || req.body.event;
  const { channel, subtype, previous_message } = req.body.event;
  const { is_bot } = req.body.authorizations;

  try {
    if (subtype === 'bot_add') {
      return res.sendStatus(200);
    } else if (!slack_user_id || slack_user_id === SLACK_GPTEAMS_BOT_ID) {
      return res.sendStatus(400);
    }

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

      if (subtype === 'message_changed') {
        await edit({
          conversation_id: conversation.id,
          slack_ts: previous_message.ts,
        });
      }

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

      const { id, user_id, content } = await DB.messages.create({
        data: {
          content: text,
          conversation_id: conversation.id,
          user_id: user.id,
          slack_ts: ts,
        },
      });

      logger.info(
        { message_id: id, user_id: user.id, ts },
        'Message created.'
      );

      const role = user_id === 'gpt' ? 'assistant' : 'user';
      const message = { role, content };
      const messages = [message];

      cache.upsert(conversation.id, { messages });
    }

    const { ts: new_ts } = await (
      await fetch('https://slack.com/api/chat.postMessage', {
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
      })
    ).json();

    const AI = new Service.AI({ conversation_id: conversation.id });
    const response = await AI.chatgpt(text);
    let stream = '';

    logger.info({ slack_user_id }, 'Slack ChatGPT Prompted.');

    const interval = setInterval(async () => {
      logger.info('Streaming response chunk...');

      if (stream) {
        const body = new_ts
          ? { text: stream, channel, ts: new_ts }
          : { text: stream, channel: slack_user_id };

        await fetch('https://slack.com/api/chat.update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
          },
          body: JSON.stringify(body),
        });
      }
    }, 2000);

    await new Promise((resolve, reject) => {
      response.data.on('data', async (data) => {
        const lines = data
          .toString()
          .split('\n')
          .filter((line) => line.trim() !== '');

        for (const line of lines) {
          try {
            const message = line.replace(/^data: /, '');

            if (message === '[DONE]') {
              return resolve(stream);
            }

            const parsed = JSON.parse(message);
            const content = parsed.choices[0].delta.content;

            if (content) stream += content;
          } catch (error) {
            // Ignore
          }
        }
      });
    });

    cache.upsert(conversation.id, {
      messages: [
        ...cache.data[conversation.id].messages,
        { role: 'assistant', content: stream },
      ],
    });

    const message = await DB.messages.create({
      data: {
        content: stream,
        conversation_id: conversation.id,
        user_id: 'gpt',
        slack_ts: ts,
      },
    });

    logger.info(
      { message_id: message.id, user_id: 'gpt', ts },
      'Message created.'
    );

    setTimeout(() => {
      clearInterval(interval);

      logger.info('Streaming stopped.');
    }, 3000);
  } catch (error) {
    logger.error(error, 'Error: Could not prompt ChatGPT from Slack.');
  }
}

async function edit({ conversation_id, slack_ts }) {
  const DB = new Service.DB('gpteams');
  const message = await DB.messages.get({
    filters: { conversation_id, slack_ts },
  });

  await DB.messages.update({
    data: {
      archived_by: message.id,
      archived_at: db.fn.now(),
    },
    filters: { conversation_id },
    where: ['created_at', '>', message.created_at],
    multiple: true,
  });

  return message;
}

async function slash(req, res, next) {
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
          { [conversation.id]: messages.length, trigger_id },
          'Messages in conversation.'
        );

        cache.upsert(conversation.id, { messages });
      }
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
      const messages = [message];

      cache.upsert(conversation.id, { messages });
    }

    const AI = new Service.AI({ conversation_id: conversation.id });
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
    cache.upsert(conversation.id, {
      messages: [
        ...cache.data[conversation.id].messages,
        { role: 'assistant', content: response },
      ],
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

Router
  .post('/dalle', slash)
  .post('/', prompt);

module.exports = Router;
