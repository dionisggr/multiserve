class Models {
  constructor(model) {
    this.model = model;
  }

  async getResponse(instance) {
    const response = instance.createChatCompletion({
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
  };  
}

module.exports = { getResponse };
