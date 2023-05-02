const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = require('../../config');
const Models = require('./models');

const config = new Configuration({ apiKey: OPENAI_API_KEY });
const conversationHistory = [];

async function prompt(input) {
  const OpenAI = new OpenAIApi(config);
  const response = await OpenAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      ...conversationHistory,
      {
        role: "user",
        content: input,
      },
    ],
  });

  return response.data.choices[0].message.content;
}

async function runChatbot(prompt) {
  let userInput = '';

  if (prompt) {
    const response = await prompt(prompt);

    return console.log(response);
  }

  while (userInput.toLowerCase() !== 'exit') {
    userInput = await new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      readline.question('> ', (input) => {
        conversationHistory.push({ role: "user", content: input });
        resolve(input);
        readline.close();
      });
    });
    const response = await prompt(userInput);
    conversationHistory.push({ role: "assistant", content: response });
    console.log(response);
  }

  console.log('Goodbye!');
  process.exit();
}

runChatbot('');
