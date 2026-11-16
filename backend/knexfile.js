const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4'
};

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      ...baseConnection,
      database: process.env.DB_NAME || 'primeroute'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },

  test: {
    client: 'mysql2',
    connection: {
      ...baseConnection,
      database: (process.env.DB_NAME || 'primeroute') + '_test'
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      ...baseConnection,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  }
};
