const fetch = require('node-fetch');
const { customError } = require('../../utils');
const {
  SLACK_GPT4TEAMS_DM_TOKEN,
  SLACK_GPT4TEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_ID,
} = require('../../config');
const { logger } = require('../../utils');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};

async function gpt4(req, res, next) {
  res.header('X-Slack-No-Retry', 1);

  const { challenge } = req.body;

  if (challenge) {
    return res.json(challenge);
  }

  const {
    user: slack_user_id = null,
    text = null,
    channel,
    channel_type,
    type,
    subtype,
    previous_message,
    ts = null,
    thread_ts = ts,
  } = req.body.event;
  const { is_bot } = req.body.authorizations;

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

    if (type !== 'app_mention' || (thread_ts !== ts && type === 'message')) {
      return res.sendStatus(400);
    }

    res.sendStatus(202);

    if (conversation) {
      logger.info({ conversation_id: conversation.id }, 'Conversation found.');

      if (subtype === 'message_changed') {
        await edit({
          conversation_id: conversation.id,
          slack_ts: previous_message.ts,
        });
      }

      const messages =
        (
          await DB.messages.get({
            filters: { conversation_id: conversation.id, archived_by: null },
            orderBy: ['created_at', 'desc'],
            multiple: true,
          })
        ).map((msg) => {
          const { content, user_id } = msg;
          const role = user_id === 'gpt4' ? 'assistant' : 'user';

          return { role, content };
        }) || [];

      logger.info(
        { [conversation.id]: messages.length, thread_ts },
        'Messages in conversation.'
      );
    } else {
      if (![type, subtype].some(val => val === 'app_mention')) {
        return res.sendStatus(400);
      }

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

      res.end();

      const { id, user_id, content } = await DB.messages.create({
        data: {
          content: text,
          conversation_id: conversation.id,
          user_id: user.id,
          slack_ts: ts,
        },
      });

      logger.info({ message_id: id, user_id: user.id, ts }, 'Message created.');

      const role = user_id === 'gpt4' ? 'assistant' : 'user';
      const message = { role, content };
      const messages = [message];
    }

    const { ts: new_ts } = await (
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SLACK_GPT4TEAMS_DM_TOKEN}`,
        },
        body: JSON.stringify({
          text: 'Thinking...',
          channel,
          thread_ts,
        }),
      })
    ).json();

    const AI = new Service.AI({
      openai_api_key: user.openai_api_key,
      conversation_id: conversation.id
    });
    const response = await AI.chatgpt4(text)
    
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
            Authorization: `Bearer ${SLACK_GPT4TEAMS_DM_TOKEN}`,
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

    const message = await DB.messages.create({
      data: {
        content: stream,
        conversation_id: conversation.id,
        user_id: 'gpt4',
        slack_ts: ts,
      },
    });

    logger.info(
      { message_id: message.id, user_id: 'gpt4', ts },
      'Message created.'
    );

    setTimeout(() => {
      clearInterval(interval);

      logger.info('Streaming stopped.');
    }, 3500);
  } catch (error) {
    logger.error(error, 'Error: Could not prompt ChatGPT from Slack.');
  }
}

module.exports = gpt4;
