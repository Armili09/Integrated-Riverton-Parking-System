const { poolPromise } = require('./config');

async function clearDatabase() {
  try {
    const pool = await poolPromise;
    console.log("Connected to DB. Wiping all data...");

    await pool.request().query(`
      DELETE FROM disputes;
      DELETE FROM citation_transactions;
      DELETE FROM permit_transactions;
      DELETE FROM citations;
      DELETE FROM permits;
      DELETE FROM vehicles;
      DELETE FROM users;
    `);

    console.log("✅ All test data has been successfully removed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error wiping database:", err);
    process.exit(1);
  }
}

clearDatabase();
