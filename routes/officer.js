const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Officer Plate Lookup
router.get("/lookup/:plate", async (req, res) => {
  try {
    const plate = req.params.plate;
    const pool = await poolPromise;
    
    // 1. Fetch Vehicle
    const vResult = await pool.request()
      .input('plate', plate)
      .query('SELECT * FROM vehicles WHERE license_number = @plate');
      
    if (vResult.recordset.length === 0) {
      return res.json({
        vehicle: null,
        owner: null,
        permit: null,
        citations: [],
        status: "NO_RECORD",
        recommendation: "ISSUE_CITATION" // No record at all in the DB
      });
    }
    
    const vehicle = vResult.recordset[0];
    
    // 2. Fetch Owner
    const oResult = await pool.request()
      .input('userId', vehicle.user_id)
      .query('SELECT user_id, name, email FROM users WHERE user_id = @userId');
    const owner = oResult.recordset.length > 0 ? oResult.recordset[0] : null;

    // 3. Fetch Permits
    const pResult = await pool.request()
      .input('plate', plate)
      .query('SELECT * FROM permits WHERE license_number = @plate ORDER BY expiry DESC');
    const permit = pResult.recordset.length > 0 ? pResult.recordset[0] : null;

    // 4. Fetch Citations
    const cResult = await pool.request()
      .input('plate', plate)
      .query('SELECT * FROM citations WHERE license_number = @plate ORDER BY issue_datetime DESC');
    const citations = cResult.recordset;

    // 5. Determine Logic
    let status = "NO_PERMIT";
    let recommendation = "ISSUE_CITATION";
    
    if (permit) {
      const now = new Date();
      const expiry = new Date(permit.expiry);
      if (expiry > now && permit.status === 'Active') {
        status = "VALID";
        recommendation = "NO_ACTION";
      } else {
        status = "EXPIRED";
        recommendation = "ISSUE_CITATION";
      }
    }

    res.json({
      vehicle,
      owner,
      permit,
      citations,
      status,
      recommendation
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Officer Issue Citation
router.post("/citation", async (req, res) => {
  try {
    const { license_number, violation_code, fine_amount, officer_name } = req.body;
    const issue_number = 'C' + Math.floor(Math.random() * 100000000).toString();
    const issue_datetime = new Date();
    
    const pool = await poolPromise;
    await pool.request()
      .input('issue_number', issue_number)
      .input('license_number', license_number)
      .input('violation_code', violation_code)
      .input('fine_amount', fine_amount)
      .input('status', 'Unpaid')
      .input('issue_datetime', issue_datetime)
      .input('officer_name', officer_name || 'System')
      .query('INSERT INTO citations (issue_number, license_number, violation_code, fine_amount, status, issue_datetime, officer_name) VALUES (@issue_number, @license_number, @violation_code, @fine_amount, @status, @issue_datetime, @officer_name)');
      
    res.status(201).json({ success: true, citation: { issue_number, license_number, violation_code, fine_amount, status: 'Unpaid', issue_datetime, officer_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all citations (for officer feed)
router.get("/citations", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM citations ORDER BY issue_datetime DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
