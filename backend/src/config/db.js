const knex = require('knex');
const knexfile = require('../../knexfile');
const env = require('./env');

const environment = env.NODE_ENV || 'development';
const config = knexfile[environment] || knexfile.development;

const db = knex(config);

module.exports = db;
