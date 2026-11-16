exports.up = async function (knex) {
  await knex.schema.createTable('employee_paperwork', (table) => {
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
    table
      .bigInteger('driver_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('drivers')
      .onDelete('RESTRICT');
    table.string('full_name', 200).notNullable();
    table.string('ssn_last4', 4).nullable();
    table.date('dob').nullable();
    table.text('address').nullable();
    table.string('phone', 50).nullable();
    table.json('emergency_contact').nullable();
    table.json('direct_deposit_details').nullable();
    table
      .enu('status', [
        'draft',
        'submitted',
        'under_review',
        'approved',
        'rejected'
      ])
      .notNullable()
      .defaultTo('draft');
    table.datetime('submitted_at').nullable();
    table
      .bigInteger('reviewed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.text('review_notes').nullable();
    table.string('signature_url', 500).nullable();
    table.timestamps(true, true);

    table.index(['user_id']);
    table.index(['driver_id']);
    table.index(['status']);
    table.index(['submitted_at']);
    table.index(['reviewed_by']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('employee_paperwork');
};
