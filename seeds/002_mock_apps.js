exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("apps").del();
  await knex("apps").insert([
    {
      id: '30fa06cd-68e9-432e-b3de-2610856ab71e',
      name: 'financial_health_planner',
    },
    {
      id: '46a2074d-cfd1-4fa2-ba09-1de4406b5a9b',
      name: 'prompt_wiz',
    },
  ]);
};
