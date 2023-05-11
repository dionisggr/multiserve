const express = require('express');
const fetch = require('node-fetch');
const utils = require('./utils');
const passwords = require('../../services/passwords');
const cache = require('../../services/cache');
const GPT4 = require('./gpt4');
const DALLE = require('./dalle');
const {
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
  logger,
} = require('../../config');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};
const home = require('./home');

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
    channel,
    type,
    subtype,
    previous_message,
    ts = null,
    thread_ts = null,
  } = req.body.event || req.body;
  const { is_bot } = req.body.authorizations || {};

  if (!slack_user_id || slack_user_id === SLACK_GPTEAMS_BOT_ID) {
    return res.sendStatus(400);
  }

  if (['app_home_opened', 'app_uninstalled', 'block_actions'].includes(type)) {
    return res.sendStatus(202);  // Accepted + Processing
  }

  try {
    const DB = new Service.DB('gpteams');
    const user = await DB.users.get({ filters: { slack_user_id } });

    if (!user) {
      return res.sendStatus(404);
    }
    
    if (!user.openai_api_key) {
      await fetch('https://slack.com/api/chat.postEphemeral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
        },
        body: JSON.stringify({
          text: 'Please add your OpenAI API Key in the GPTeams "Home" tab first.',
          user: user.slack_user_id,
          channel,
        }),
      });

      return res.sendStatus(400);
    }

    let conversation = await DB.conversations.get({
      filters: {
        slack_ts: thread_ts || ts,
        slack_channel: channel,
      },
    });

    if (conversation) {
      logger.info({ conversation_id: conversation.id }, 'Conversation found.');

      res.sendStatus(202);  // Accepted + Processing

      if (subtype === 'message_changed') {
        await utils.archive({
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
          { [conversation.id]: messages.length, thread_ts: thread_ts || ts },
          'Messages in conversation.'
        );

        cache.upsert(conversation.id, { messages });
      }
    } else {
      if (type !== 'app_mention' && channel !== SLACK_GPTEAMS_BOT_CHANNEL) {
        return res.sendStatus(400);
      }

      res.sendStatus(202); // Accepted + Processing

      conversation = await DB.conversations.create({
        data: {
          title: 'GPTeams Conversation',
          created_by: user.id,
          type: is_bot ? 'single' : 'group',
          slack_ts: thread_ts || ts,
          slack_channel: channel,
        },
      });

      logger.info(
        { conversation_id: conversation.id, thread_ts: thread_ts || ts },
        'Conversation created.'
      );

      const { id, user_id, content } = await DB.messages.create({
        data: {
          content: text,
          conversation_id: conversation.id,
          user_id: user.id,
          slack_ts: ts,
        },
      });

      logger.info({ message_id: id, user_id: user.id, ts }, 'Message created.');

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
          thread_ts: thread_ts || ts,
        }),
      })
    ).json();

    
    const AI = new Service.AI({
      openai_api_key: user.openai_api_key,
      conversation_id: conversation.id,
    });
    const response = await AI.chatgpt(text);

    logger.info({ slack_user_id }, 'Slack ChatGPT Prompted.');

    let stream = '';

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
    }, 3500);
  } catch (error) {
    logger.error(error, 'Error: Could not prompt ChatGPT from Slack.');

    next(error);
  }
}

Router
  .post('/gpteams', prompt)
  .post('/gpteams/home', home)
  .post('/gpt4teams', GPT4)
  .post('/dalle', DALLE);

module.exports = Router;
