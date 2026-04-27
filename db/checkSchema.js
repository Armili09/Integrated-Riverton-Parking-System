const { poolPromise } = require('./config');

async function run() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE (TABLE_NAME = 'permits' AND COLUMN_NAME = 'license_number')
       OR (TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'license_number')
       OR (TABLE_NAME = 'disputes' AND COLUMN_NAME = 'issue_number')
       OR (TABLE_NAME = 'citations' AND COLUMN_NAME = 'issue_number')
  `);
  console.table(result.recordset);
  process.exit(0);
}

run();
