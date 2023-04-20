const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.dropTableIfExists('apps');
  await db.schema.createTable('apps', function(table) {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.boolean('is_archived').defaultTo(false);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
  });

  logger.info('Table "apps" created successfully!');
};

exports.down = async function(db) {
  await db.schema.dropTable('apps');

  logger.info('Table "apps" deleted successfully!');
};
