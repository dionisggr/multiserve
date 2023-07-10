const { ADMIN_PASSWORD, CHATTERAI_OPENAI_API_KEY } = require('../../config');
const Service = require('../../services/DB');

const app = 'chatterai';
const service = new Service();

exports.seed = async function (db) {
  // Setup
  const admin_password = await service.passwords.hash(
    service.passwords.encrypt(ADMIN_PASSWORD)
  );
  const demo_password = await service.passwords.hash(
    service.passwords.encrypt('password')
  );

  // App
  await db('apps').insert([
    {
      id: app,
      name: 'Chatter.AI',
    },
  ]);

  // Users
  await db(`${app}__users`).del();
  await db(`${app}__users`).insert([  
    {
      id: 'dio',
      username: 'dio',
      email: 'dionisggr@gmail.com',
      password: admin_password,
      is_admin: true,
      openai_api_key: CHATTERAI_OPENAI_API_KEY,
    },
    {
      id: 'demo',
      first_name: 'Demo',
      last_name: 'Demo',
      email: 'demo@demo.com',
      password: demo_password,
      username: 'demo',
      avatar: 'https://www.gravatar.com/avatar/1111?s=200&d=robohash',
    },
    {
      id: 1,
      first_name: 'John',
      last_name: 'First',
      email: 'john@first.com',
      username: 'john',
      avatar: 'https://www.gravatar.com/avatar/2222?s=200&d=robohash',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Second',
      email: 'jane@second.com',
      username: 'jane',
      avatar: 'https://www.gravatar.com/avatar/3333?s=200&d=robohash',
    },
    {
      id: 3,
      first_name: 'James',
      last_name: 'Third',
      email: 'james@third.com',
      username: 'james',
      avatar: 'https://www.gravatar.com/avatar/4444?s=200&d=robohash',
    },
    {
      id: 4,
      first_name: 'Jill',
      last_name: 'Fourth',
      email: 'jill@fourth.com',
      username: 'jill',
      avatar: 'https://www.gravatar.com/avatar/5555?s=200&d=robohash',
    },
    {
      id: 5,
      first_name: 'Jack',
      last_name: 'Fifth',
      email: 'jack@fifth.com',
      username: 'jack',
      avatar: 'https://www.gravatar.com/avatar/6666?s=200&d=robohash',
    },
    { id: 'chatterai' },
    { id: 'chatgpt' },
    { id: 'gpt-4' },
    { id: 'dall-e' },
    { id: 'whisper' },
  ]);

  // Organizations
  await db(`${app}__organizations`).del();
  await db(`${app}__organizations`).insert([
    { id: 'demo', name: 'Chatter.AI', created_by: 'demo' },
    { id: 'personal', name: 'Personal', created_by: 'demo' },
  ]);

  // User Organizations
  await db(`${app}__user_organizations`).del();
  await db(`${app}__user_organizations`).insert([
    { user_id: 'demo', organization_id: 'demo' },
    { user_id: 1, organization_id: 'demo' },
    { user_id: 2, organization_id: 'demo' },
    { user_id: 3, organization_id: 'demo' },
    { user_id: 4, organization_id: 'demo' },
    { user_id: 5, organization_id: 'demo' },
  ]);

  // Conversations
  await db(`${app}__conversations`).del();
  await db(`${app}__conversations`).insert([
    {
      id: 1,
      title: 'Groceries',
      type: 'public',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 2,
      title: 'Hangouts',
      type: 'public',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 3,
      title: 'Travel Planning',
      type: 'public',
      created_by: 1,
      organization_id: 'demo',
    },
    {
      id: 4,
      title: 'Group Project',
      type: 'public',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 5,
      title: 'Product Manager',
      type: 'public',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 6,
      title: 'Diary',
      type: 'private',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 7,
      title: 'Personal Finances',
      type: 'private',
      created_by: 'demo',
      organization_id: 'demo',
    },
    {
      id: 8,
      title: 'Game Night',
      type: 'public',
      created_by: 3,
      organization_id: 'demo',
    },
  ]);

  // User Conversations
  await db(`${app}__user_conversations`).del();
  await db(`${app}__user_conversations`).insert([
    { user_id: 'demo', conversation_id: 1 },
    { user_id: 'demo', conversation_id: 2 },
    { user_id: 'demo', conversation_id: 3 },
    { user_id: 'demo', conversation_id: 4 },
    { user_id: 'demo', conversation_id: 5 },
    { user_id: 'demo', conversation_id: 6 },
    { user_id: 'demo', conversation_id: 7 },
    { user_id: 'demo', conversation_id: 8 },
    { user_id: 1, conversation_id: 1 },
    { user_id: 1, conversation_id: 2 },
    { user_id: 1, conversation_id: 3 },
    { user_id: 1, conversation_id: 4 },
    { user_id: 1, conversation_id: 5 },
    { user_id: 1, conversation_id: 8 },
    { user_id: 2, conversation_id: 1 },
    { user_id: 2, conversation_id: 2 },
    { user_id: 2, conversation_id: 3 },
    { user_id: 2, conversation_id: 4 },
    { user_id: 2, conversation_id: 5 },
    { user_id: 2, conversation_id: 8 },
    { user_id: 3, conversation_id: 1 },
    { user_id: 3, conversation_id: 2 },
    { user_id: 3, conversation_id: 3 },
    { user_id: 3, conversation_id: 4 },
    { user_id: 3, conversation_id: 5 },
    { user_id: 3, conversation_id: 8 },
    { user_id: 4, conversation_id: 1 },
    { user_id: 4, conversation_id: 2 },
    { user_id: 4, conversation_id: 3 },
    { user_id: 4, conversation_id: 4 },
    { user_id: 4, conversation_id: 5 },
    { user_id: 4, conversation_id: 8 },
    { user_id: 5, conversation_id: 1 },
    { user_id: 5, conversation_id: 2 },
    { user_id: 5, conversation_id: 3 },
    { user_id: 5, conversation_id: 4 },
    { user_id: 5, conversation_id: 5 },
    { user_id: 5, conversation_id: 8 },
  ]);

  // Messages
  await db(`${app}__messages`).del();
  await db(`${app}__messages`).insert([
    // For Groceries
    {
      id: 1,
      user_id: 'demo',
      conversation_id: 1,
      content: 'Hey, GPT. Can you add milk and eggs for the next grocery shopping?',
      created_at: '2023-06-01 00:00:00',
    },
    {
      id: 2,
      user_id: 'chatgpt',
      conversation_id: 1,
      content: 'Sure. Would you like to add the same ones as last time?',
      created_at: '2023-06-01 00:00:01',
    },
    {
      id: 3,
      user_id: 1,
      conversation_id: 1,
      content: 'Yep. Can you also add the same cereal from that one?',
      created_at: '2023-06-01 00:00:02',
    },
    {
      id: 4,
      user_id: 'chatgpt',
      conversation_id: 1,
      content: 'You got it.',
      created_at: '2023-06-01 00:00:03',
    },
    {
      id: 5,
      user_id: 'demo',
      conversation_id: 1,
      content: 'GPT, I\m going to the store. What do I have so far on the list?',
      created_at: '2023-06-02 00:01:03',
    },
    {
      id: 6,
      user_id: 'chatgpt',
      conversation_id: 1,
      content: 'You have milk, eggs, and cereal on the list. Would you like any information or suggestions about the items?',
      created_at: '2023-06-02 00:01:03',
    },

    // For Hangouts
    {
      id: 7,
      user_id: 'demo',
      conversation_id: 2,
      content: 'Who is free for a get-together this weekend?',
    },
    {
      id: 8,
      user_id: 1,
      conversation_id: 2,
      content: 'I am in, any plans?'
    },
    {
      id: 9,
      user_id: 2,
      conversation_id: 2,
      content: 'How about we try that new cafe downtown?',
    },
    {
      id: 10,
      user_id: 'chatgpt',
      conversation_id: 2,
      content: 'Did you mean the one on 5th and Main or the one on 3rd and Elm?',
    },
    {
      id: 11,
      user_id: 'demo',
      conversation_id: 2,
      content: 'Definitely the one on 5th and Main.',
    },
    {
      id: 12,
      user_id: 3,
      conversation_id: 2,
      content: 'Yeah, how about we forget 3rd and Elm ever existed?'
    },
    {
      id: 13,
      user_id: 'chatgpt',
      conversation_id: 2,
      content: 'Do you want me to remove it from future suggestions?',
    },
    {
      id: 14,
      user_id: 4,
      conversation_id: 2,
      content: 'Ugh, I wish we could just forget about it. Yes, please.'
    },
    {
      id: 15,
      user_id: 5,
      conversation_id: 2,
      content: 'I might be a bit late, got a prior appointment.',
    },
    {
      id: 16,
      user_id: 3,
      conversation_id: 2,
      content: 'See you all there!'
    },
    {
      id: 17,
      user_id: 'chatgpt',
      conversation_id: 2,
      content: 'I will send you all a reminder on Friday.',
    },

    // For Travel Planning
    {
      id: 18,
      user_id: "demo",
      conversation_id: 3,
      content: "How about that Punta Cana this summer? Was that still on?",
    },
    {
      id: 19,
      user_id: 1,
      conversation_id: 3,
      content: "What's was our budget looking like?",
    },
    {
      id: 20,
      user_id: 'demo',
      conversation_id: 3,
      content: "You know, sometimes it\'s all about embracing the moment without looking at your bank.",
    },
    {
      id: 21,
      user_id: 'chatgpt',
      conversation_id: 3,
      content: "I think your bank would say different.",
    },
    {
      id: 22,
      user_id: '4',
      conversation_id: 3,
      content: "Hahaha",
    },
    {
      id: 23,
      user_id: 'demo',
      conversation_id: 3,
      content: "GPT, shush.",
    },
    {
      id: 24,
      user_id: 'chatgpt',
      conversation_id: 3,
      content: "Someone seems to be on a mood today.",
    },
    {
      id: 70,
      user_id: 4,
      conversation_id: 3,
      content: "The sassiness.",
    },
    {
      id: 25,
      user_id: 5,
      conversation_id: 3,
      content: 'I would love a beach vacation.',
    },
    {
      id: 26,
      user_id: 3,
      conversation_id: 3,
      content: 'What about the Maldives?',
    },
    {
      id: 27,
      user_id: 'chatgpt',
      conversation_id: 3,
      content: 'This summer, the Maldives will be hosting the first-ever World Beach Games.',
    },
    {
      id: 28,
      user_id: 2,
      conversation_id: 3,
      content: 'That already sounds like a plan!',
    },
    {
      id: 29,
      user_id: 4,
      conversation_id: 3,
      content: 'Maldives sounds great. What about accommodation?',
    },
    {
      id: 30,
      user_id: 'chatgpt',
      conversation_id: 3,
      content: 'I have found a few options for you. Would you like to see them?',
    },

    // For Group Project
    {
      id: 31,
      user_id: 'demo',
      conversation_id: 4,
      content: 'We need to finalize the project design by this week.',
    },
    {
      id: 32,
      user_id: 'chatgpt',
      conversation_id: 4,
      content: 'The project\'s pending requirements include: 1. Work on the front end.\n2. Work on the presentation.',
    },
    {
      id: 33,
      user_id: 2,
      conversation_id: 4,
      content: 'I can work on the frontend.',
    },
    {
      id: 34,
      user_id: 3,
      conversation_id: 4,
      content: "Then, I'll handle the presentation.",
    },
    {
      id: 71,
      user_id: 'chatgpt',
      conversation_id: 4,
      content: "I detect that the last message sent by the professor contained new requirements for the end result. Would you like me to review them here?",
    },
    {
      id: 35,
      user_id: 'demo',
      conversation_id: 4,
      content: "Oh, really? Yes, please!",
    },

    // For Product Manager
    {
      id: 36,
      user_id: 'demo',
      conversation_id: 5,
      content: 'We need to discuss our product roadmap for the next quarter.',
    },
    {
      id: 37,
      user_id: 'chatgpt',
      conversation_id: 5,
      content: 'The roadmap for next quarter includes the new features around X and the implementation of Y.',
    },
    {
      id: 38,
      user_id: 2,
      conversation_id: 5,
      content: 'Should we prioritize feature X or Y first?',
    },
    {
      id: 39,
      user_id: 'chatgpt',
      conversation_id: 5,
      content: 'Based on the initial requirements discussed at the start of this chat, I would recommend prioritizing feature X given it\'s higher impact on customers, and our client\'s interest in next phases surrounding X.',
    },
    {
      id: 40,
      user_id: 3,
      conversation_id: 5,
      content: 'We have a lot of customer requests for feature X too.',
    },
    {
      id: 41,
      user_id: 'demo',
      conversation_id: 5,
      content: 'Sounds like X is our next plan then.',
    },
    {
      id: 42,
      user_id: 4,
      conversation_id: 5,
      content: "Let's also consider our technical debt.",
    },
    {
      id: 43,
      user_id: 'chatgpt',
      conversation_id: 5,
      content: 'Jill brings up a good point. There is technical debt related to existing code changes required before X\'s implementation.',
    },
    {
      id: 44,
      user_id: 'demo',
      conversation_id: 5,
      content: "Let's have a detailed discussion tomorrow about this then.",
    },
    {
      id: 45,
      user_id: 'chatgpt',
      conversation_id: 5,
      content: "Would you like me to send everyone a calendar invite for tomorrow's meeting?",
    },
    {
      id: 46,
      user_id: 'demo',
      conversation_id: 5,
      content: "Yes, and please mark it urgent.",
    },
    {
      id: 47,
      user_id: 'chatgpt',
      conversation_id: 5,
      content: "You got it.",
    },

    // For Diary
    {
      id: 48,
      user_id: 'demo',
      conversation_id: 6,
      content: 'Feeling great about the progress made today.',
    },
    {
      id: 49,
      user_id: 'chatgpt',
      conversation_id: 6,
      content: "That's exciting to hear! Was this on the gym routine or your work project?",
    },
    {
      id: 50,
      user_id: 'demo',
      conversation_id: 6,
      content: "Neither! The hobby project we first discussed.",
    },
    {
      id: 51,
      user_id: 'chatgpt',
      conversation_id: 6,
      content: "Ah, the AI chat application. I'm really glad to hear you're making progress on that.",
    },
    {
      id: 52,
      user_id: 'demo',
      conversation_id: 6,
      content: "Thanks! But there is so much more to do, so many use cases for it! How do I prioritize?",
    },
    {
      id: 53,
      user_id: 'chatgpt',
      conversation_id: 6,
      content: "I think you should keep your application brief and simple for now. You should highlight its potential capabilities until there is growing interest in it.",
    },

    // For Personal Finances
    {
      id: 54,
      user_id: 'demo',
      conversation_id: 7,
      content: 'I need to set a budget for the next month.',
    },
    {
      id: 55,
      user_id: 'chatgpt',
      conversation_id: 7,
      content: "Understood. Let's start by reviewing your income for this month. Is there any remaining budget from the previous month?",
    },
    {
      id: 56,
      user_id: 'demo',
      conversation_id: 7,
      content: "Yes, I have a remaining budget of $500 from last month.",
    },
    {
      id: 57,
      user_id: 'chatgpt',
      conversation_id: 7,
      content: "Excellent. Now, could you provide an overview of your expected expenses for this month?",
    },
    {
      id: 58,
      user_id: 'demo',
      conversation_id: 7,
      content: "Before we go into this month's expenses, I would like to review last month's spending first.",
    },
    {
      id: 59,
      user_id: 'chatgpt',
      conversation_id: 7,
      content: "Of course, let's analyze your previous month's expenses to get a better understanding.",
    },
    {
      id: 60,
      user_id: 'demo',
      conversation_id: 7,
      content: "Can you divide the expenses into categories?",
    },
    {
      id: 61,
      user_id: 'chatgpt',
      conversation_id: 7,
      content: "Should I sort them by frequency like the last time, or amount because our goal will be to set a budget?",
    },

    // For Game Night
    {
      id: 62,
      user_id: 'demo',
      conversation_id: 8,
      content: 'Game night on Friday, get ready everyone.',
    },
    {
      id: 63,
      user_id: 1,
      conversation_id: 8,
      content: 'What game were we playing?',
    },
    {
      id: 64,
      user_id: 2,
      conversation_id: 8,
      content: 'How about Among Us?'
    },
    {
      id: 65,
      user_id: 'chatgpt',
      conversation_id: 8,
      content: 'There is a new selection of games on Steam, I recommend checking them out. Would you like me to link them here?',
    },
    {
      id: 66,
      user_id: 'demo',
      conversation_id: 8,
      content: "Sure, let's see what you got."
    },
    {
      id: 68,
      user_id: 2,
      conversation_id: 8,
      content: 'Awesome!',
    },
  ]);
};
