const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('users').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const plainPassword = process.env.SEED_PASSWORD || 'Password123!';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const seedUsers = [
    {
      id: 1,
      name: 'Marcus Brody',
      email: 'marcus.brody@primeroute.io',
      password_hash: passwordHash,
      role: 'owner',
      status: 'active',
      phone: '+1 (555) 019-2831',
      mfa_enabled: false
    },
    {
      id: 2,
      name: 'Elena Vance',
      email: 'elena.vance@primeroute.io',
      password_hash: passwordHash,
      role: 'secondary_admin',
      status: 'active',
      phone: '+1 (555) 019-2832',
      mfa_enabled: false
    },
    {
      id: 3,
      name: 'Michael Chang',
      email: 'michael.chang@primeroute.io',
      password_hash: passwordHash,
      role: 'finance',
      status: 'active',
      phone: '+1 (555) 019-2833',
      mfa_enabled: false
    },
    {
      id: 4,
      name: 'Tom Gallagher',
      email: 'tom.gallagher@primeroute.io',
      password_hash: passwordHash,
      role: 'fleet_maintenance',
      status: 'active',
      phone: '+1 (555) 019-2834',
      mfa_enabled: false
    },
    {
      id: 5,
      name: 'Sarah Connor',
      email: 'sarah.connor@primeroute.io',
      password_hash: passwordHash,
      role: 'rental_operations',
      status: 'active',
      phone: '+1 (555) 019-2835',
      mfa_enabled: false
    },
    {
      id: 6,
      name: 'Rachel Green',
      email: 'rachel.green@primeroute.io',
      password_hash: passwordHash,
      role: 'readonly_manager',
      status: 'active',
      phone: '+1 (555) 019-2836',
      mfa_enabled: false
    }
  ];

  await knex('users').insert(seedUsers);
};
