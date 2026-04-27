const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Get citations for a specific user's vehicles
router.get("/user/:userId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', req.params.userId)
      .query(`
        SELECT c.*, v.state, v.type as vehicle_type
        FROM citations c
        JOIN vehicles v ON c.license_number = v.license_number
        WHERE v.user_id = @userId
        ORDER BY c.issue_datetime DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Issue Citation (Usually by officer, but added for completeness)
router.post("/", async (req, res) => {
  try {
    const { license_number, violation_code, fine_amount } = req.body;
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
      .query('INSERT INTO citations (issue_number, license_number, violation_code, fine_amount, status, issue_datetime) VALUES (@issue_number, @license_number, @violation_code, @fine_amount, @status, @issue_datetime)');
      
    res.status(201).json({ success: true, citation: { issue_number, license_number, violation_code, fine_amount, status: 'Unpaid', issue_datetime } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay citation
router.put('/:id/pay', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', req.params.id)
      .query("UPDATE citations SET status = 'Paid' WHERE issue_number = @id");
      
    res.json({ success: true, message: 'Citation paid completely' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
