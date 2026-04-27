const { poolPromise } = require('./config');

async function run() {
  try {
    const pool = await poolPromise;
    console.log("Connected to DB. Adding Foreign Keys...");

    // Add FK from permits.license_number to vehicles.license_number
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_permits_vehicles')
      BEGIN
        ALTER TABLE permits 
        ADD CONSTRAINT FK_permits_vehicles 
        FOREIGN KEY (license_number) 
        REFERENCES vehicles(license_number);
      END
    `);

    // Add FK from disputes.issue_number to citations.issue_number
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_disputes_citations')
      BEGIN
        ALTER TABLE disputes 
        ADD CONSTRAINT FK_disputes_citations 
        FOREIGN KEY (issue_number) 
        REFERENCES citations(issue_number);
      END
    `);

    console.log("✅ Foreign keys added successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error adding foreign keys:", err.message);
    process.exit(1);
  }
}

run();
