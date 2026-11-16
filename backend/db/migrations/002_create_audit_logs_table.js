exports.up = async function (knex) {
  await knex.schema.createTable('audit_logs', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.string('module', 100).notNullable();
    table.string('action', 100).notNullable();
    table.string('entity_type', 100).nullable();
    table.bigInteger('entity_id').unsigned().nullable();
    table.json('old_values').nullable();
    table.json('new_values').nullable();
    table.string('ip_address', 50).nullable();
    table.text('user_agent').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['user_id']);
    table.index(['module']);
    table.index(['action']);
    table.index(['entity_type', 'entity_id']);
    table.index(['created_at']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('audit_logs');
};
