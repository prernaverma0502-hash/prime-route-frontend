const { TICKET_STATUSES } = require('../../src/config/constants');

exports.up = async function (knex) {
  await knex.schema.createTable('tolls_tickets', (table) => {
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
      .nullable()
      .references('id')
      .inTable('drivers')
      .onDelete('RESTRICT');
    table
      .bigInteger('rental_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table.string('violation_number', 100).notNullable();
    table.datetime('violation_date').notNullable();
    table.string('issuing_authority', 150).notNullable();
    table
      .enu('violation_type', ['toll', 'speeding', 'red_light', 'parking', 'other'])
      .notNullable()
      .defaultTo('toll');
    table.decimal('amount', 12, 2).notNullable();
    table.date('due_date').nullable();
    table.enu('status', TICKET_STATUSES).notNullable().defaultTo('unassigned');
    table.boolean('driver_charged').notNullable().defaultTo(false);
    table
      .bigInteger('invoice_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('invoices')
      .onDelete('RESTRICT');
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['rental_id']);
    table.index(['violation_number']);
    table.index(['violation_date']);
    table.index(['status']);
    table.index(['invoice_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('tolls_tickets');
};
