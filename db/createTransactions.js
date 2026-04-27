const { sql, poolPromise } = require('./config');

async function createTables() {
  try {
    const pool = await poolPromise;
    console.log("Connected to DB. Creating tables...");

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='permit_transactions' and xtype='U')
      CREATE TABLE permit_transactions (
          transaction_id VARCHAR(50) PRIMARY KEY,
          permit_id VARCHAR(20) FOREIGN KEY REFERENCES permits(permit_id),
          amount DECIMAL(10, 2),
          transaction_datetime DATETIME
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='citation_transactions' and xtype='U')
      CREATE TABLE citation_transactions (
          transaction_id VARCHAR(50) PRIMARY KEY,
          issue_number VARCHAR(20) FOREIGN KEY REFERENCES citations(issue_number),
          amount DECIMAL(10, 2),
          c_transaction_datetime DATETIME
      );
    `);

    console.log("✅ Transaction tables created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
}

createTables();
