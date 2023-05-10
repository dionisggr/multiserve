const express = require('express');
const fetch = require('node-fetch');
const {
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  STATUSPAGE_PAGE_ID,
  STATUSPAGE_TEC3_API_ID,
  STATUSPAGE_GPTEAMS_ID,
  STATUSPAGE_API_KEY,
  STATUSPAGE_URL,
} = require('../../config');

const Router = express.Router();

async function incidents(req, res, next) {
  res.header('X-Slack-No-Retry', 1);

  const { challenge } = req.body;

  if (challenge) {
    return res.json(challenge);
  }

  const { text, channel_id: channel, user_id: slack_user_id } = req.body;
  const endpoint = 'https://api.statuspage.io/v1';
  const components = {
    'tec3-api': STATUSPAGE_TEC3_API_ID,
    gpteams: STATUSPAGE_GPTEAMS_ID,
  };
  const { operation } = req.query;
  const parameters = text.split(' ');

  if (!operation) return res.end();

  if (!slack_user_id || slack_user_id === SLACK_GPTEAMS_BOT_ID) {
    return res.sendStatus(400);
  }

  if (operation === 'create') {
    const [project, status, incident_status, ...name] = parameters;

    if (!project || !status || !incident_status || !name.length) {
      return res.sendStatus(400);
    }

    const result = await (
      await fetch(
        `${endpoint}/pages/${STATUSPAGE_PAGE_ID}/incidents?api_key=${STATUSPAGE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            incident: {
              name: name.join(' '),
              status: incident_status,
              components: { [components[project]]: status },
              component_ids: [components[project]],
            },
          }),
        }
      )
    ).json();

    setTimeout(async () => {
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SLACK_GPTEAMS_DM_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `Incident ID: ${result.id}\n<${STATUSPAGE_URL}|Update Status>`,
          channel,
        }),
      });
    }, 3500);
  } else if (operation === 'update') {
    const [incident_id, status, project_status, ...comment] = parameters;

    if (!incident_id || !status || !project_status) {
      return res.sendStatus(400);
    }

    const incident = await (
      await fetch(
        `${endpoint}/pages/${STATUSPAGE_PAGE_ID}/incidents/${incident_id}?api_key=${STATUSPAGE_API_KEY}`
      )
    ).json();
    const projects = {};

    for (let i = 0; i < incident.components.length; i++) {
      const { id } = incident.components[i];

      projects[id] = project_status;
    }

    const body = {
      incident: {
        component_ids: Object.keys(projects),
        components: projects,
        status,
      },
    };

    if (comment.length) {
      body.incident.body = comment.join(' ');
    }

    await fetch(
      `${endpoint}/pages/${STATUSPAGE_PAGE_ID}/incidents/${incident_id}?api_key=${STATUSPAGE_API_KEY}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
  } else if (operation === 'resolve') {
    const [incident_id, ...comment] = parameters;

    if (!incident_id) {
      return res.sendStatus(400);
    }

    const incident = await (
      await fetch(
        `${endpoint}/pages/${STATUSPAGE_PAGE_ID}/incidents/${incident_id}?api_key=${STATUSPAGE_API_KEY}`
      )
    ).json();
    const projects = {};

    for (let i = 0; i < incident.components.length; i++) {
      const { id } = incident.components[i];

      projects[id] = 'operational';
    }

    const body = {
      incident: {
        status: 'resolved',
        component_ids: Object.keys(projects),
        components: projects,
      },
    };

    if (comment.length) {
      body.incident.body = comment.join(' ');
    }

    await fetch(
      `${endpoint}/pages/${STATUSPAGE_PAGE_ID}/incidents/${incident_id}?api_key=${STATUSPAGE_API_KEY}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
  }

  res.end();
};

Router
  .post('/incidents', incidents);

module.exports = Router;
