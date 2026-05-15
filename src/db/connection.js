const oracledb = require('node-oracledb');

let pool = null;

async function initPool() {
  if (pool) return pool;

  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  });

  console.log('Oracle connection pool created');
  return pool;
}

async function getConnection() {
  if (!pool) throw new Error('DB pool not initialized. Call initPool() first.');
  return pool.getConnection();
}

async function closePool() {
  if (!pool) return;
  await pool.close(0);
  pool = null;
  console.log('Oracle connection pool closed');
}

module.exports = { initPool, getConnection, closePool };
