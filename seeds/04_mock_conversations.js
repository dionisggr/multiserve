exports.seed = async function (db) {
  await db("conversations").del();
  await db("conversations").insert([
    {
      id: "4f752c08-f541-499c-96b3-253945eeddfc",
      title: "Important Meeting",
      app_id: "06a63cb0-b8b6-433e-9ab8-e2887bd150f4",
    },
    {
      id: "ad9d5fed-548a-4069-8e22-0f4b987ae8c6",
      title: "Casual Chat",
      app_id: "6d786386-c7b0-41f5-a2b0-2efa1bca065f",
    },
  ]);
};
