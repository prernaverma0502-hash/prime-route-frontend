exports.up = async function (knex) {
  // 1. inspections table
  await knex.schema.createTable('inspections', (table) => {
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
      .bigInteger('vehicle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('vehicles')
      .onDelete('RESTRICT');
    table
      .bigInteger('inspector_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table
      .enu('inspection_type', ['pickup', 'return', 'routine'])
      .notNullable();
    table.datetime('inspection_date').notNullable();
    table.integer('odometer').notNullable();
    table.string('fuel_level', 50).nullable();
    table.json('condition_checklist').nullable();
    table.text('notes').nullable();
    table.boolean('driver_acknowledged').notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.index(['rental_id']);
    table.index(['vehicle_id']);
    table.index(['inspector_id']);
    table.index(['inspection_type']);
    table.index(['inspection_date']);
  });

  // 2. inspection_photos table
  await knex.schema.createTable('inspection_photos', (table) => {
    table.engine('InnoDB');
    table.charset('utf8mb4');
    table.bigIncrements('id').primary();
    table
      .bigInteger('inspection_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('inspections')
      .onDelete('CASCADE');
    table.string('photo_url', 500).notNullable();
    table.string('caption', 255).nullable();
    table
      .enu('tag', [
        'exterior_front',
        'exterior_back',
        'exterior_left',
        'exterior_right',
        'interior',
        'dashboard_odometer',
        'damage_detail',
        'other'
      ])
      .notNullable()
      .defaultTo('other');
    table.timestamps(true, true);

    table.index(['inspection_id']);
    table.index(['tag']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('inspection_photos');
  await knex.schema.dropTableIfExists('inspections');
};
