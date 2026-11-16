exports.up = async function (knex) {
  // 1. accidents table
  await knex.schema.createTable('accidents', (table) => {
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
    table.datetime('accident_date').notNullable();
    table.string('location', 255).nullable();
    table.text('description').nullable();
    table.string('police_report_no', 100).nullable();
    table.decimal('estimated_damage', 12, 2).nullable();
    table
      .enu('status', ['reported', 'under_investigation', 'repair_pending', 'resolved'])
      .notNullable()
      .defaultTo('reported');
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['rental_id']);
    table.index(['accident_date']);
    table.index(['status']);
  });

  // 2. insurance_policies table
  await knex.schema.createTable('insurance_policies', (table) => {
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
    table.string('policy_number', 100).notNullable();
    table.string('insurer_name', 150).notNullable();
    table.string('coverage_type', 100).notNullable();
    table.decimal('premium', 12, 2).notNullable();
    table.decimal('deductible', 12, 2).notNullable().defaultTo(0.00);
    table.date('effective_date').notNullable();
    table.date('expiry_date').notNullable();
    table
      .enu('status', ['active', 'expired', 'cancelled'])
      .notNullable()
      .defaultTo('active');
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['policy_number']);
    table.index(['expiry_date']);
    table.index(['status']);
  });

  // 3. insurance_claims table
  await knex.schema.createTable('insurance_claims', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('policy_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('insurance_policies')
      .onDelete('RESTRICT');
    table
      .bigInteger('accident_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('accidents')
      .onDelete('RESTRICT');
    table
      .bigInteger('vehicle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('vehicles')
      .onDelete('RESTRICT');
    table.string('claim_number', 100).notNullable();
    table.date('claim_date').notNullable();
    table.decimal('claim_amount', 12, 2).notNullable();
    table.decimal('payout_amount', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('deductible_applied', 12, 2).notNullable().defaultTo(0.00);
    table
      .enu('status', ['submitted', 'under_review', 'approved', 'denied', 'settled'])
      .notNullable()
      .defaultTo('submitted');
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.index(['policy_id']);
    table.index(['accident_id']);
    table.index(['vehicle_id']);
    table.index(['claim_number']);
    table.index(['status']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('insurance_claims');
  await knex.schema.dropTableIfExists('insurance_policies');
  await knex.schema.dropTableIfExists('accidents');
};
