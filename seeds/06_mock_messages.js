exports.seed = async function (db) {
  await db("messages").del();
  await db("messages").insert([
    {
      id: "1bf37874-bb86-4424-a514-d04ebad653d4",
      content: "Hello, everyone!",
      user_id: "fc0e8a81-8252-42fd-854f-6192c6eed939",
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
    },
    {
      id: "4c81f171-53b2-4f27-b7a5-2cd5b2910752",
      content: "How are you all doing?",
      user_id: "68ae0a4c-c575-4a44-b9b9-48b49919a3c6",
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
    },
    {
      id: "3e626bc7-cb42-4ba5-938a-35ecce4e0f8c",
      content: "Hey there!",
      user_id: "0babe65a-d467-4f99-8a04-120e74bc60de",
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
    },
    {
      id: "a61860ff-5ceb-42ce-b99d-6798600ae818",
      content: "What's up?",
      user_id: "a178dda2-5378-4901-aacf-a9137b783ebe",
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
    },
  ]);
};