exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("apps").del();
  await knex("apps").insert([
    {
      id: '06a63cb0-b8b6-433e-9ab8-e2887bd150f4',
      name: 'financial_health_planner',
    },
    {
      id: '6d786386-c7b0-41f5-a2b0-2efa1bca065f',
      name: 'prompt_wiz',
    },
  ]);
};
