const { EXPENSE_CATEGORIES } = require('../../src/config/constants');

exports.up = async function (knex) {
  // 1. vendors table
  await knex.schema.createTable('vendors', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('name', 200).notNullable();
    table.string('service_type', 100).nullable();
    table.string('contact_person', 150).nullable();
    table.string('email', 255).nullable();
    table.string('phone', 50).nullable();
    table.text('address').nullable();
    table.enu('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.timestamps(true, true);

    table.index(['name']);
    table.index(['service_type']);
    table.index(['status']);
  });

  // 2. expenses table
  await knex.schema.createTable('expenses', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('vehicle_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('vehicles')
      .onDelete('RESTRICT');
    table
      .bigInteger('vendor_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('vendors')
      .onDelete('RESTRICT');
    table
      .bigInteger('rental_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table
      .bigInteger('recorded_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table
      .bigInteger('approver_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.enu('category', EXPENSE_CATEGORIES).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.date('expense_date').notNullable();
    table.string('payment_method', 100).nullable();
    table.string('invoice_receipt_url', 500).nullable();
    table.text('description').nullable();
    table
      .enu('status', ['pending', 'approved', 'rejected', 'paid'])
      .notNullable()
      .defaultTo('pending');
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['vendor_id']);
    table.index(['rental_id']);
    table.index(['category']);
    table.index(['expense_date']);
    table.index(['status']);
  });

  // 3. maintenance_records table
  await knex.schema.createTable('maintenance_records', (table) => {
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
      .bigInteger('vendor_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('vendors')
      .onDelete('RESTRICT');
    table.date('service_date').notNullable();
    table.integer('odometer').notNullable();
    table.string('service_type', 150).notNullable();
    table.text('description').nullable();
    table.decimal('cost', 12, 2).notNullable();
    table.string('invoice_url', 500).nullable();
    table.integer('next_service_odometer').nullable();
    table.date('next_service_date').nullable();
    table
      .enu('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])
      .notNullable()
      .defaultTo('scheduled');
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['vendor_id']);
    table.index(['service_date']);
    table.index(['status']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('maintenance_records');
  await knex.schema.dropTableIfExists('expenses');
  await knex.schema.dropTableIfExists('vendors');
};
