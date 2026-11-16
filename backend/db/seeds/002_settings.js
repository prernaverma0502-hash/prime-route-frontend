exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('settings').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const defaultSettings = [
    {
      setting_key: 'company_name',
      setting_value: 'PrimeRoute Fleet Solutions',
      description: 'Official registered company business name'
    },
    {
      setting_key: 'company_email',
      setting_value: 'operations@primeroute.io',
      description: 'Primary customer support and operations email'
    },
    {
      setting_key: 'company_phone',
      setting_value: '+1 (555) 234-5678',
      description: 'Primary company phone number'
    },
    {
      setting_key: 'company_address',
      setting_value: '1200 Fleet Management Way, Suite 400, Chicago, IL 60607',
      description: 'Headquarters physical address'
    },
    {
      setting_key: 'oil_change_interval_miles',
      setting_value: '5000',
      description: 'Standard mileage threshold trigger for scheduled routine oil change'
    },
    {
      setting_key: 'default_weekly_deposit',
      setting_value: '500.00',
      description: 'Standard refundable security deposit held per vehicle lease'
    },
    {
      setting_key: 'currency',
      setting_value: 'USD',
      description: 'Default operational and accounting currency'
    },
    {
      setting_key: 'timezone',
      setting_value: 'America/Chicago',
      description: 'Default operational timezone'
    },
    {
      setting_key: 'late_fee_percentage',
      setting_value: '5.00',
      description: 'Percentage penalty applied on overdue driver lease balances'
    }
  ];

  await knex('settings').insert(defaultSettings);
};
