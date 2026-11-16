exports.up = async function (knex) {
  // 1. documents table
  await knex.schema.createTable('documents', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table.string('title', 255).notNullable();
    table.string('document_type', 100).notNullable();
    table.string('file_url', 500).notNullable();
    table.integer('file_size').unsigned().nullable();
    table.string('mime_type', 100).nullable();
    table
      .bigInteger('vehicle_id')
      .unsigned()
      .nullable()
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
    table
      .bigInteger('uploaded_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.date('expiry_date').nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['rental_id']);
    table.index(['uploaded_by']);
    table.index(['document_type']);
    table.index(['expiry_date']);
  });

  // 2. document_versions table
  await knex.schema.createTable('document_versions', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('document_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('documents')
      .onDelete('CASCADE');
    table.integer('version_number').notNullable().defaultTo(1);
    table.string('file_url', 500).notNullable();
    table.integer('file_size').unsigned().nullable();
    table
      .bigInteger('uploaded_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.text('change_summary').nullable();
    table.timestamps(true, true);

    table.index(['document_id']);
    table.index(['uploaded_by']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('document_versions');
  await knex.schema.dropTableIfExists('documents');
};
