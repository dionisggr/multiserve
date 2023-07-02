exports.seed = async function (db) {
  const app = 'promptwiz';

  await db(`${app}__prompts`).del();
  await db(`${app}__prompts`).insert([
    {
      id: '77b1c042-168a-4315-a49f-705f9d00dc59',
      title: 'Prompt Title 1',
      prompt: '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
    {
      id: '1dbcb23d-ad11-48dc-9076-6fef3d51fe25',
      title: 'Prompt Title 2',
      prompt: '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
    {
      id: '5d285529-a4ce-4b56-ad8e-bb1634afbcc4',
      title: 'Prompt Title 3',
      prompt: '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
  ]);
};
