const { poolPromise } = require('./db/config');
async function run() {
  const pool = await poolPromise;
  const res = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permits'");
  console.log(res.recordset);
  process.exit(0);
}
run();
