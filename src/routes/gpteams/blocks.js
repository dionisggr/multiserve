const installed = [
  {
    type: 'section',
    block_id: 'welcome_section',
    text: {
      type: 'mrkdwn',
      text: ':wave:  *Welcome to GPTeams!*',
    },
  },
  {
    type: 'section',
    block_id: 'whitespace_1',
    text: {
      type: 'mrkdwn',
      text: ' ',
    },
  },
  {
    type: 'section',
    block_id: 'gpteams_description',
    text: {
      type: 'mrkdwn',
      text: 'GPTeams is powered by OpenAI and ChatGPT, cutting-edge AI technologies designed to assist you in various tasks. Please note that the usage of these services is token-cost based, meaning you will need an OpenAI API Key to access them.',
    },
  },
  {
    type: 'section',
    block_id: 'whitespace_2',
    text: {
      type: 'mrkdwn',
      text: ' ',
    },
  },
  {
    type: 'section',
    block_id: 'api_key_info',
    text: {
      type: 'mrkdwn',
      text: "If you don't have an OpenAI API Key, you can create one by visiting: <https://platform.openai.com/account/api-keys|https://platform.openai.com/account/api-keys>",
    },
  },
  {
    type: 'input',
    block_id: 'api_key_input',
    label: {
      type: 'plain_text',
      text: 'OpenAI API Key',
    },
    element: {
      type: 'plain_text_input',
      action_id: 'api_key',
      placeholder: {
        type: 'plain_text',
        text: 'Enter your API key here',
      },
    },
  },
  {
    type: 'actions',
    block_id: 'register',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Submit',
        },
        action_id: 'register',
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Developed by Tec3, LLC :computer:',
      },
      {
        type: 'mrkdwn',
        text: '<https://www.tec3org.com|Visit our website>',
      },
    ],
  },
];

const registered = [
  {
    type: 'section',
    block_id: 'thanks',
    text: {
      type: 'mrkdwn',
      text: ' *Thank you for trying GPTeams!*',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    block_id: 'whitespace_1',
    text: {
      type: 'mrkdwn',
      text: ' ',
    },
  },
  {
    type: 'section',
    block_id: 'welcome_section',
    text: {
      type: 'mrkdwn',
      text: '*OpenAI API Key*',
    },
  },
  {
    type: 'section',
    block_id: 'api_key_successs',
    text: {
      type: 'mrkdwn',
      text: ':white_check_mark: *Successfully added!*',
    },
  },
  {
    type: 'section',
    block_id: 'whitespace_2',
    text: {
      type: 'mrkdwn',
      text: ' ',
    },
  },
  {
    type: 'section',
    block_id: 'getting_started',
    text: {
      type: 'mrkdwn',
      text: '*Getting Started:*',
    },
  },
  {
    type: 'section',
    block_id: 'getting_started_instructions',
    text: {
      type: 'mrkdwn',
      text: '1. Visit the *GPTeams* channel or add it to an existing channel.\n2. *@GPTeams* to any conversation to begin its context.\n3. Once called, *GPTeams* will respond to every new thread message below it.\n4. Message *GPTeams* directly for private context conversations.\n5. Visit the *About* section for usage of slash commands.\n6. For feedback or direct feature requests, email us at tec3org@gmail.com! ',
    },
  },
];

module.exports = { installed, registered };
