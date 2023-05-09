const db = require('../../db');
const Service = {
  AI: require('../../services/AI'),
  DB: require('../../services/DB'),
};

async function archive({ conversation_id, slack_ts }) {
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
};

module.exports = { archive };
