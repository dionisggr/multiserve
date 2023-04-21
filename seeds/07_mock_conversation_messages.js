exports.seed = async function (db) {
  await db("conversation_messages").del();
  await db("conversation_messages").insert([
    {
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
      message_id: "1bf37874-bb86-4424-a514-d04ebad653d4",
    },
    {
      conversation_id: "4f752c08-f541-499c-96b3-253945eeddfc",
      message_id: "4c81f171-53b2-4f27-b7a5-2cd5b2910752",
    },
    {
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
      message_id: "3e626bc7-cb42-4ba5-938a-35ecce4e0f8c",
    },
    {
      conversation_id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
      message_id: "a61860ff-5ceb-42ce-b99d-6798600ae818",
    },
  ]);
};