const { LEDGER_ENTRY_TYPES, EXPENSE_CATEGORIES } = require('../../src/config/constants');

exports.up = async function (knex) {
  // 1. invoices table
  await knex.schema.createTable('invoices', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('invoice_number', 100).notNullable().unique();
    table
      .bigInteger('rental_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table
      .bigInteger('driver_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('drivers')
      .onDelete('RESTRICT');
    table
      .bigInteger('issued_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.date('issue_date').notNullable();
    table.date('due_date').notNullable();
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('tax', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('total_amount', 12, 2).notNullable();
    table.decimal('paid_amount', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('balance', 12, 2).notNullable().defaultTo(0.00);
    table
      .enu('status', [
        'draft',
        'issued',
        'partially_paid',
        'paid',
        'overdue',
        'cancelled',
        'void'
      ])
      .notNullable()
      .defaultTo('draft');
    table.timestamps(true, true);

    table.index(['rental_id']);
    table.index(['driver_id']);
    table.index(['issued_by']);
    table.index(['issue_date']);
    table.index(['due_date']);
    table.index(['status']);
  });

  // 2. invoice_items table
  await knex.schema.createTable('invoice_items', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('invoice_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('invoices')
      .onDelete('CASCADE');
    table.string('description', 255).notNullable();
    table.enu('category', EXPENSE_CATEGORIES).nullable();
    table.decimal('quantity', 8, 2).notNullable().defaultTo(1.00);
    table.decimal('unit_price', 12, 2).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.timestamps(true, true);

    table.index(['invoice_id']);
  });

  // 3. ledger_entries table
  await knex.schema.createTable('ledger_entries', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('rental_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('rentals')
      .onDelete('RESTRICT');
    table
      .bigInteger('driver_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('drivers')
      .onDelete('RESTRICT');
    table
      .bigInteger('invoice_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('invoices')
      .onDelete('RESTRICT');
    table
      .bigInteger('recorded_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.enu('entry_type', LEDGER_ENTRY_TYPES).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table
      .enu('payment_method', [
        'cash',
        'zelle',
        'stripe',
        'card',
        'bank_transfer',
        'credit',
        'adjustment'
      ])
      .nullable();
    table.string('reference_no', 100).nullable();
    table.text('notes').nullable();
    table.datetime('entry_date').notNullable();
    table.timestamps(true, true);

    table.index(['rental_id']);
    table.index(['driver_id']);
    table.index(['invoice_id']);
    table.index(['recorded_by']);
    table.index(['entry_type']);
    table.index(['reference_no']);
    table.index(['entry_date']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('ledger_entries');
  await knex.schema.dropTableIfExists('invoice_items');
  await knex.schema.dropTableIfExists('invoices');
};
