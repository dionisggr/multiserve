exports.seed = async function (db) {
  // Deletes ALL existing entries
  await db("user_apps").del();
  await db("user_apps").insert([
    {
      user_id: 'e66a39d0-2b78-42f2-aecb-ee4ec5bbdcdd',
      app_id: '30fa06cd-68e9-432e-b3de-2610856ab71e',
    },
    {
      user_id: 'e66a39d0-2b78-42f2-aecb-ee4ec5bbdcdd',
      app_id: '46a2074d-cfd1-4fa2-ba09-1de4406b5a9b',
    },
    {
      user_id: '4f39884f-2aa8-45cc-9f39-054b28bd02e9',
      app_id: '30fa06cd-68e9-432e-b3de-2610856ab71e',
    },
    {
      user_id: '4f39884f-2aa8-45cc-9f39-054b28bd02e9',
      app_id: '46a2074d-cfd1-4fa2-ba09-1de4406b5a9b',
    },
    {
      user_id: '06278bf3-7476-4c95-84da-57b4f448bb67',
      app_id: '30fa06cd-68e9-432e-b3de-2610856ab71e',
    },
    {
      user_id: '06278bf3-7476-4c95-84da-57b4f448bb67',
      app_id: '46a2074d-cfd1-4fa2-ba09-1de4406b5a9b',
    },
    {
      user_id: '001ef402-f0ba-46c2-93ef-32886a5a86f3',
      app_id: '30fa06cd-68e9-432e-b3de-2610856ab71e',
    },
    {
      user_id: '001ef402-f0ba-46c2-93ef-32886a5a86f3',
      app_id: '46a2074d-cfd1-4fa2-ba09-1de4406b5a9b',
    },
  ]);
};
