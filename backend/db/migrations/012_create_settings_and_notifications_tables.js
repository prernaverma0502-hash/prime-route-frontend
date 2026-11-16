exports.up = async function (knex) {
  // 1. settings table
  await knex.schema.createTable('settings', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('setting_key', 100).notNullable().unique();
    table.text('setting_value').nullable();
    table.string('description', 255).nullable();
    table.timestamps(true, true);

    table.index(['setting_key']);
  });

  // 2. notification_rules table
  await knex.schema.createTable('notification_rules', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('event_type', 100).notNullable().unique();
    table.string('title', 200).notNullable();
    table.enu('channel', ['email', 'sms', 'both']).notNullable().defaultTo('email');
    table.integer('lead_time_days').notNullable().defaultTo(0);
    table.json('recipients').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index(['event_type']);
    table.index(['is_active']);
  });

  // 3. alert_history table
  await knex.schema.createTable('alert_history', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('rule_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('notification_rules')
      .onDelete('SET NULL');
    table.string('event_type', 100).notNullable();
    table.string('title', 200).notNullable();
    table
      .enu('severity', ['info', 'warning', 'danger'])
      .notNullable()
      .defaultTo('info');
    table.text('message').nullable();
    table.string('related_entity_type', 100).nullable();
    table.bigInteger('related_entity_id').unsigned().nullable();
    table.datetime('resolved_at').nullable();
    table
      .bigInteger('resolved_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);

    table.index(['rule_id']);
    table.index(['event_type']);
    table.index(['severity']);
    table.index(['related_entity_type', 'related_entity_id']);
    table.index(['resolved_at']);
    table.index(['resolved_by']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('alert_history');
  await knex.schema.dropTableIfExists('notification_rules');
  await knex.schema.dropTableIfExists('settings');
};
