const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  database: 'indosakti',
});

module.exports = pool;