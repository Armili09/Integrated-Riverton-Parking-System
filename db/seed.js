const { sql, poolPromise } = require('./config');

async function seedDatabase() {
  try {
    const pool = await poolPromise;
    console.log("Connected to DB. Starting reset...");

    // 0. Ensure schema has application_date
    console.log("Checking schema...");
    try {
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'permits' AND COLUMN_NAME = 'application_date'
        )
        BEGIN
          ALTER TABLE permits ADD application_date DATETIME;
        END
      `);
    } catch (e) {
      console.log("Schema check skipped/failed: ", e.message);
    }

    // 1. Wipe existing tables (in reverse dependency order to avoid FK issues)
    console.log("Wiping existing data...");
    await pool.request().query(`
      DELETE FROM disputes;
      DELETE FROM citation_transactions;
      DELETE FROM permit_transactions;
      DELETE FROM citations;
      DELETE FROM permits;
      DELETE FROM vehicles;
      DELETE FROM users;
    `);

    // 2. Seed Users
    console.log("Seeding designated Old User data...");
    const userId = "USR-DEMO";
    const randomUserId = "USR-RANDOM";
    await pool.request()
      .input('user_id', userId)
      .input('name', "Peter Parker")
      .input('email', "old@user.com")
      .input('password', "1234")
      .input('r_user_id', randomUserId)
      .input('r_name', "Random Owner")
      .input('r_email', "random@user.com")
      .input('r_password', "1234")
      .query(`
        INSERT INTO users (user_id, name, email, password) VALUES (@user_id, @name, @email, @password);
        INSERT INTO users (user_id, name, email, password) VALUES (@r_user_id, @r_name, @r_email, @r_password);
      `);

    // 3. Vehicles
    const vehiclesData = [
      { plate: 'YKS0661', state: 'AR', type: 'Passenger', uid: userId },
      { plate: 'CAT2251', state: 'KY', type: 'SUV', uid: userId },
      { plate: 'VBZ6463', state: 'MO', type: 'Motorcycle', uid: randomUserId },
      { plate: 'JYL6606', state: 'MO', type: 'Van', uid: randomUserId },
      { plate: 'LUO8050', state: 'MO', type: 'Van', uid: randomUserId },
      { plate: 'MGO5929', state: 'MO', type: 'Truck', uid: randomUserId },
      { plate: 'CZD9879', state: 'MO', type: 'SUV', uid: randomUserId },
      { plate: 'KTE4044', state: 'MO', type: 'SUV', uid: randomUserId },
      { plate: 'PZR0826', state: 'MO', type: 'Motorcycle', uid: randomUserId },
      { plate: 'VJY9423', state: 'MO', type: 'Passenger', uid: randomUserId },
      { plate: 'UXW7012', state: 'MO', type: 'Truck', uid: randomUserId },
      { plate: 'RHO6706', state: 'IL', type: 'Truck', uid: randomUserId },
      { plate: 'RRP8912', state: 'MO', type: 'Motorcycle', uid: randomUserId },
      { plate: 'HTL5384', state: 'MO', type: 'SUV', uid: randomUserId },
      
      // Additional plates from Citations image to avoid FK errors
      { plate: 'BDO3917', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'VTR5643', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'YDD1526', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'ILB3018', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'GKR0905', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'TSK0128', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'VEL4624', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'NVG3345', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'KDJ7483', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'BBL4263', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'HVN4472', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'WID9081', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'YUQ6945', state: 'NY', type: 'Sedan', uid: randomUserId },
      { plate: 'TIB5817', state: 'NY', type: 'Sedan', uid: randomUserId },
    ];

    let vSql = vehiclesData.map(v => `INSERT INTO vehicles (license_number, state, type, user_id) VALUES ('${v.plate}', '${v.state}', '${v.type}', '${v.uid}');`).join('\n');
    await pool.request().query(vSql);

    // 4. Permits
    const expiryNextYear = new Date();
    expiryNextYear.setFullYear(expiryNextYear.getFullYear() + 1);
    
    const expiryLastMonth = new Date();
    expiryLastMonth.setMonth(expiryLastMonth.getMonth() - 1);

    await pool.request()
      .input('p1_id', "PKT-1001")
      .input('v1', "YKS0661")
      .input('exp1', expiryNextYear)
      .input('p2_id', "PKT-1002")
      .input('v2', "CAT2251")
      .input('exp2', expiryLastMonth)
      .input('appDate', new Date())
      .query(`
        INSERT INTO permits (permit_id, license_number, type, status, expiry, application_date) VALUES (@p1_id, @v1, 'Residential', 'Active', @exp1, @appDate);
        INSERT INTO permits (permit_id, license_number, type, status, expiry, application_date) VALUES (@p2_id, @v2, 'Visitor', 'Expired', @exp2, @appDate);
      `);

    // 5. Citations
    const citationsData = [
      { id: 'CIT-00019', dt: '2025-01-05 13:02:12', off: 'Kevin Patel', viol: 'NO PERMIT', amt: 90, plate: 'BDO3917', status: 'DISPUTED' },
      { id: 'CIT-00020', dt: '2025-03-08 19:04:35', off: 'Kevin Patel', viol: 'EXPIRED METER', amt: 35, plate: 'VTR5643', status: 'DISPUTED' },
      { id: 'CIT-00021', dt: '2025-08-05 10:07:44', off: 'Rachel Kim', viol: 'EXPIRED METER', amt: 30, plate: 'YDD1526', status: 'OPEN' },
      { id: 'CIT-00022', dt: '2025-07-23 11:01:09', off: 'Marcus Reed', viol: 'OVERTIME PARKING', amt: 55, plate: 'ILB3018', status: 'PAID' },
      { id: 'CIT-00023', dt: '2025-08-27 22:44:19', off: 'Kevin Patel', viol: 'EXPIRED METER', amt: 30, plate: 'GKR0905', status: 'PAID' },
      { id: 'CIT-00024', dt: '2025-04-09 22:10:00', off: 'Stephanie Barnes', viol: 'EXPIRED METER', amt: 40, plate: 'TSK0128', status: 'OPEN' },
      { id: 'CIT-00025', dt: '2025-05-22 14:05:33', off: 'Derek Thompson', viol: 'STREET CLEANING', amt: 60, plate: 'VEL4624', status: 'OPEN' },
      { id: 'CIT-00026', dt: '2025-06-28 08:52:44', off: 'Tina Walsh', viol: 'FIRE HYDRANT', amt: 170, plate: 'NVG3345', status: 'OPEN' },
      { id: 'CIT-00027', dt: '2025-05-09 07:51:23', off: 'Stephanie Barnes', viol: 'OVERTIME PARKING', amt: 50, plate: 'KDJ7483', status: 'PAID' },
      { id: 'CIT-00028', dt: '2025-01-28 08:13:38', off: 'James Carter', viol: 'OVERTIME PARKING', amt: 40, plate: 'VJY9423', status: 'OPEN' },
      { id: 'CIT-00029', dt: '2025-08-19 07:03:20', off: 'Kevin Patel', viol: 'DOUBLE PARKING', amt: 120, plate: 'BBL4263', status: 'OPEN' },
      { id: 'CIT-00030', dt: '2025-03-20 12:20:48', off: 'Rachel Kim', viol: 'NO PARKING ZONE', amt: 115, plate: 'HVN4472', status: 'OPEN' },
      { id: 'CIT-00031', dt: '2025-07-02 22:06:32', off: 'James Carter', viol: 'EXPIRED METER', amt: 45, plate: 'WID9081', status: 'OPEN' },
      { id: 'CIT-00032', dt: '2025-10-03 08:45:14', off: 'Brian Nguyen', viol: 'EXPIRED METER', amt: 40, plate: 'YUQ6945', status: 'PAID' },
      { id: 'CIT-00033', dt: '2025-06-08 16:18:23', off: 'Donna Simmons', viol: 'EXPIRED METER', amt: 45, plate: 'TIB5817', status: 'PAID' },
    ];

    let cSql = citationsData.map(c => 
      `INSERT INTO citations (issue_number, license_number, violation_code, fine_amount, status, issue_datetime, officer_name) 
       VALUES ('${c.id}', '${c.plate}', '${c.viol}', ${c.amt}, '${c.status}', '${c.dt}', '${c.off}');`
    ).join('\n');
    
    await pool.request().query(cSql);

    // 6. Disputes
    const disputeId = 'D' + Math.floor(Math.random() * 100000).toString();
    await pool.request()
      .input('dispute_id', disputeId)
      .input('c2_id', 'CIT-00020')
      .input('date', new Date())
      .query(`
        INSERT INTO disputes (dispute_id, issue_number, reason, status, created_at)
        VALUES (@dispute_id, @c2_id, 'I was only parked there for a minute!', 'Resolved', @date);
      `);

    // 7. Permit Transactions
    console.log("Seeding permit transactions...");
    const permitTxData = [
      { id: 'TXN-P-10001', pid: 'PKT-1001', amt: 150, dt: new Date().toISOString().replace('T', ' ').substring(0, 19) },
      { id: 'TXN-P-10002', pid: 'PKT-1002', amt: 50, dt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().replace('T', ' ').substring(0, 19) },
    ];
    let ptSql = permitTxData.map(pt => 
      `INSERT INTO permit_transactions (transaction_id, permit_id, amount, transaction_datetime) 
       VALUES ('${pt.id}', '${pt.pid}', ${pt.amt}, '${pt.dt}');`
    ).join('\n');
    await pool.request().query(ptSql);

    // 8. Citation Transactions
    console.log("Seeding citation transactions...");
    const citationTxData = [
      { id: 'TXN-C-20001', cid: 'CIT-00022', amt: 55, dt: '2025-07-25 14:00:00' },
      { id: 'TXN-C-20002', cid: 'CIT-00023', amt: 30, dt: '2025-08-28 09:30:00' },
      { id: 'TXN-C-20003', cid: 'CIT-00027', amt: 50, dt: '2025-05-10 11:15:00' },
      { id: 'TXN-C-20004', cid: 'CIT-00032', amt: 40, dt: '2025-10-05 16:45:00' },
      { id: 'TXN-C-20005', cid: 'CIT-00033', amt: 45, dt: '2025-06-10 08:20:00' },
    ];
    let ctSql = citationTxData.map(ct => 
      `INSERT INTO citation_transactions (transaction_id, issue_number, amount, c_transaction_datetime) 
       VALUES ('${ct.id}', '${ct.cid}', ${ct.amt}, '${ct.dt}');`
    ).join('\n');
    await pool.request().query(ctSql);

    console.log("✅ Database reset and seeded successfully.");
    console.log("   --- Old User ---");
    console.log("   Email: old@user.com");
    console.log("   Password: 1234");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
