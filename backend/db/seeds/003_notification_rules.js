exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('notification_rules').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const defaultRules = [
    {
      event_type: 'overdue_payments',
      title: 'Overdue Driver Lease Payments',
      channel: 'both',
      lead_time_days: 1,
      recipients: JSON.stringify(['finance', 'owner']),
      is_active: true
    },
    {
      event_type: 'contract_ending',
      title: 'Upcoming Rental Contract Expirations',
      channel: 'email',
      lead_time_days: 7,
      recipients: JSON.stringify(['rental_operations', 'secondary_admin']),
      is_active: true
    },
    {
      event_type: 'document_expiry',
      title: 'Driver License, Registration or Insurance Expiration',
      channel: 'both',
      lead_time_days: 14,
      recipients: JSON.stringify(['fleet_maintenance', 'rental_operations']),
      is_active: true
    },
    {
      event_type: 'oil_change_due',
      title: 'Vehicle 5,000-Mile Oil Change Due',
      channel: 'email',
      lead_time_days: 3,
      recipients: JSON.stringify(['fleet_maintenance']),
      is_active: true
    },
    {
      event_type: 'unpaid_tolls_tickets',
      title: 'Unpaid Tolls or Violation Citations Received',
      channel: 'email',
      lead_time_days: 2,
      recipients: JSON.stringify(['rental_operations', 'finance']),
      is_active: true
    },
    {
      event_type: 'missing_documents',
      title: 'Missing Required Driver or Vehicle Documents',
      channel: 'email',
      lead_time_days: 0,
      recipients: JSON.stringify(['rental_operations']),
      is_active: true
    },
    {
      event_type: 'unresolved_accidents',
      title: 'Unresolved Accident Reports & Open Insurance Claims',
      channel: 'both',
      lead_time_days: 0,
      recipients: JSON.stringify(['fleet_maintenance', 'owner']),
      is_active: true
    },
    {
      event_type: 'vehicles_awaiting_inspection',
      title: 'Vehicles Awaiting Pickup or Return Inspection',
      channel: 'email',
      lead_time_days: 0,
      recipients: JSON.stringify(['fleet_maintenance', 'rental_operations']),
      is_active: true
    }
  ];

  await knex('notification_rules').insert(defaultRules);
};
