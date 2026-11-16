const { ROLES } = require('../../src/config/constants');

exports.up = async function (knex) {
  // 1. users table
  await knex.schema.createTable('users', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enu('role', ROLES).notNullable().defaultTo('readonly_manager');
    table.enu('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active');
    table.string('phone', 50).nullable();
    table.boolean('mfa_enabled').notNullable().defaultTo(false);
    table.string('mfa_secret', 255).nullable();
    table.timestamps(true, true);

    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });

  // 2. refresh_tokens table
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token_hash', 255).notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('revoked_at').nullable();
    table.timestamps(true, true);

    table.index(['user_id']);
    table.index(['token_hash']);
    table.index(['expires_at']);
  });

  // 3. mfa_backup_codes table
  await knex.schema.createTable('mfa_backup_codes', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('code_hash', 255).notNullable();
    table.timestamp('used_at').nullable();
    table.timestamps(true, true);

    table.index(['user_id']);
  });

  // 4. invitations table
  await knex.schema.createTable('invitations', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('email', 255).notNullable();
    table.enu('role', ROLES).notNullable();
    table.string('token', 255).notNullable().unique();
    table
      .bigInteger('invited_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('expires_at').notNullable();
    table.timestamp('accepted_at').nullable();
    table.timestamps(true, true);

    table.index(['email']);
    table.index(['invited_by']);
  });

  // 5. password_resets table
  await knex.schema.createTable('password_resets', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token_hash', 255).notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('used_at').nullable();
    table.timestamps(true, true);

    table.index(['user_id']);
    table.index(['token_hash']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('password_resets');
  await knex.schema.dropTableIfExists('invitations');
  await knex.schema.dropTableIfExists('mfa_backup_codes');
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('users');
};
