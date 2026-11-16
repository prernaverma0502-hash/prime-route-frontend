const { RENTAL_STATUSES } = require('../../src/config/constants');

exports.up = async function (knex) {
  // 1. rentals table
  await knex.schema.createTable('rentals', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('contract_no', 100).notNullable().unique();
    table
      .bigInteger('vehicle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('vehicles')
      .onDelete('RESTRICT');
    table
      .bigInteger('driver_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('drivers')
      .onDelete('RESTRICT');
    table
      .bigInteger('created_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.enu('status', RENTAL_STATUSES).notNullable().defaultTo('draft');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('weekly_rate', 12, 2).notNullable();
    table.decimal('deposit_amount', 12, 2).notNullable().defaultTo(0.00);
    table.integer('mileage_at_pickup').notNullable().defaultTo(0);
    table.integer('mileage_at_return').nullable();
    table.text('terms').nullable();
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['created_by']);
    table.index(['status']);
    table.index(['start_date']);
    table.index(['end_date']);
  });

  // 2. rental_amendments table
  await knex.schema.createTable('rental_amendments', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('rental_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table
      .bigInteger('amended_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.string('amendment_type', 100).notNullable();
    table.date('previous_end_date').nullable();
    table.date('new_end_date').nullable();
    table.decimal('previous_weekly_rate', 12, 2).nullable();
    table.decimal('new_weekly_rate', 12, 2).nullable();
    table.text('reason').nullable();
    table.timestamps(true, true);

    table.index(['rental_id']);
    table.index(['amended_by']);
  });

  // 3. rental_signatures table
  await knex.schema.createTable('rental_signatures', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('rental_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table.string('signer_name', 255).notNullable();
    table.enu('signer_role', ['driver', 'owner', 'manager']).notNullable();
    table.text('signature_data', 'long').notNullable();
    table.string('ip_address', 50).nullable();
    table.datetime('signed_at').notNullable();
    table.timestamps(true, true);

    table.index(['rental_id']);
    table.index(['signed_at']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('rental_signatures');
  await knex.schema.dropTableIfExists('rental_amendments');
  await knex.schema.dropTableIfExists('rentals');
};
