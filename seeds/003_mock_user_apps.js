exports.seed = async function (db) {
  // Deletes ALL existing entries
  await db("user_apps").del();
  await db("user_apps").insert([
    {
      user_id: 'fc0e8a81-8252-42fd-854f-6192c6eed939',
      app_id: '06a63cb0-b8b6-433e-9ab8-e2887bd150f4',
    },
    {
      user_id: 'fc0e8a81-8252-42fd-854f-6192c6eed939',
      app_id: '6d786386-c7b0-41f5-a2b0-2efa1bca065f',
    },
    {
      user_id: '68ae0a4c-c575-4a44-b9b9-48b49919a3c6',
      app_id: '06a63cb0-b8b6-433e-9ab8-e2887bd150f4',
    },
    {
      user_id: '68ae0a4c-c575-4a44-b9b9-48b49919a3c6',
      app_id: '6d786386-c7b0-41f5-a2b0-2efa1bca065f',
    },
    {
      user_id: '0babe65a-d467-4f99-8a04-120e74bc60de',
      app_id: '06a63cb0-b8b6-433e-9ab8-e2887bd150f4',
    },
    {
      user_id: '0babe65a-d467-4f99-8a04-120e74bc60de',
      app_id: '6d786386-c7b0-41f5-a2b0-2efa1bca065f',
    },
    {
      user_id: 'a178dda2-5378-4901-aacf-a9137b783ebe',
      app_id: '06a63cb0-b8b6-433e-9ab8-e2887bd150f4',
    },
    {
      user_id: 'a178dda2-5378-4901-aacf-a9137b783ebe',
      app_id: '6d786386-c7b0-41f5-a2b0-2efa1bca065f',
    },
  ]);
};
