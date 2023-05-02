require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const conversationHistory = [];

async function getResponse(prompt) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
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
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content;
}

async function runChatbot(prompt) {
  let userInput = '';

  if (prompt) {
    const response = await getResponse(prompt);

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
    const response = await getResponse(userInput);
    conversationHistory.push({ role: "assistant", content: response });
    console.log(response);
  }

  console.log('Goodbye!');
  process.exit();
}

runChatbot('');
