const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Get User's Permits via their vehicles
router.get("/user/:userId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', req.params.userId)
      .query(`
        SELECT p.*, v.state 
        FROM permits p 
        JOIN vehicles v ON p.license_number = v.license_number 
        WHERE v.user_id = @userId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for Permit
router.post("/", async (req, res) => {
  try {
    const { license_number, type, end_date } = req.body;
    const permit_id = 'P' + Math.floor(Math.random() * 100000000).toString();
    
    let expiry = new Date();
    if (end_date) {
      expiry = new Date(end_date);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1); // fallback to 1 year
    }
    const application_date = new Date();
    
    // Determine status based on type
    let initialStatus = 'Pending';
    if (type === 'Visitor') {
      initialStatus = 'Active';
    }

    const pool = await poolPromise;
    await pool.request()
      .input('permit_id', permit_id)
      .input('license_number', license_number)
      .input('type', type)
      .input('status', initialStatus)
      .input('expiry', expiry)
      .input('application_date', application_date)
      .query('INSERT INTO permits (permit_id, license_number, type, status, expiry, application_date) VALUES (@permit_id, @license_number, @type, @status, @expiry, @application_date)');
      
    // Auto-approve Residential permits after 2 minutes for demonstration purposes
    if (type === 'Residential') {
      setTimeout(async () => {
        try {
          const asyncPool = await poolPromise;
          await asyncPool.request()
            .input('permit_id', permit_id)
            .query("UPDATE permits SET status = 'Active' WHERE permit_id = @permit_id");
          console.log(`Auto-approved Residential permit ${permit_id}`);
        } catch (err) {
          console.error(`Failed to auto-approve permit ${permit_id}:`, err);
        }
      }, 2 * 60 * 1000); // 2 minutes
    }

    res.status(201).json({ success: true, permit: { permit_id, license_number, type, status: initialStatus, expiry, application_date } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Officer check route
router.get("/check/:plate", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('plate', req.params.plate)
      .query("SELECT * FROM permits WHERE license_number = @plate AND status = 'Active'");
      
    if (result.recordset.length > 0) {
      res.json({ plate: req.params.plate, valid: true, permit: result.recordset[0] });
    } else {
      res.json({ plate: req.params.plate, valid: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
