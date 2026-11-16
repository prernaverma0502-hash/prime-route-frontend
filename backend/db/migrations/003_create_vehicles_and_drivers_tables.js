const { VEHICLE_STATUSES } = require('../../src/config/constants');

exports.up = async function (knex) {
  // 1. vehicles table
  await knex.schema.createTable('vehicles', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('vin', 50).notNullable().unique();
    table.string('plate', 50).notNullable().unique();
    table.string('make', 100).notNullable();
    table.string('model', 100).notNullable();
    table.integer('year').notNullable();
    table.string('color', 50).nullable();
    table.integer('mileage').notNullable().defaultTo(0);
    table.enu('status', VEHICLE_STATUSES).notNullable().defaultTo('available');
    table.date('purchase_date').nullable();
    table.decimal('purchase_price', 12, 2).nullable();
    table.text('financing_details').nullable();
    table.string('location', 255).nullable();
    table.timestamp('archived_at').nullable();
    table.timestamps(true, true);

    table.index(['status']);
    table.index(['make', 'model']);
    table.index(['archived_at']);
  });

  // 2. drivers table
  await knex.schema.createTable('drivers', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).nullable();
    table.string('phone', 50).nullable();
    table.string('license_number', 100).nullable();
    table.string('license_state', 10).nullable();
    table.date('license_expiry').nullable();
    table
      .enu('status', ['active', 'inactive', 'suspended', 'pending'])
      .notNullable()
      .defaultTo('pending');
    table.decimal('balance', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('deposit_held', 12, 2).notNullable().defaultTo(0.00);
    table.text('notes').nullable();
    table.timestamp('archived_at').nullable();
    table.timestamps(true, true);

    table.index(['email']);
    table.index(['license_number']);
    table.index(['license_expiry']);
    table.index(['status']);
    table.index(['archived_at']);
  });

  // 3. vehicle_assignments table
  await knex.schema.createTable('vehicle_assignments', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
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
      .bigInteger('assigned_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.datetime('start_date').notNullable();
    table.datetime('end_date').nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['assigned_by']);
    table.index(['start_date']);
    table.index(['end_date']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('vehicle_assignments');
  await knex.schema.dropTableIfExists('drivers');
  await knex.schema.dropTableIfExists('vehicles');
};
