exports.seed = async function (db) {

  await db("user_conversations").del();
  await db("user_conversations").insert([
    {
      user_id: "fc0e8a81-8252-42fd-854f-6192c6eed939",
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
    },
    {
      user_id: "68ae0a4c-c575-4a44-b9b9-48b49919a3c6",
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
    },
    {
      user_id: "0babe65a-d467-4f99-8a04-120e74bc60de",
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
    },
    {
      user_id: "a178dda2-5378-4901-aacf-a9137b783ebe",
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
    },
  ]);
};
