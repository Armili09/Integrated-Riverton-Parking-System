const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Get disputes by citation ID
router.get("/citation/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query("SELECT * FROM disputes WHERE issue_number = @id");
    
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Dispute
router.post("/", async (req, res) => {
  try {
    const { issue_number, reason } = req.body;
    const dispute_id = 'D' + Math.floor(Math.random() * 100000000).toString();
    const created_at = new Date();
    
    const pool = await poolPromise;
    // Transaction or just Insert and optionally update citation status
    await pool.request()
      .input('dispute_id', dispute_id)
      .input('issue_number', issue_number)
      .input('reason', reason)
      .input('status', 'Pending')
      .input('created_at', created_at)
      .query('INSERT INTO disputes (dispute_id, issue_number, reason, status, created_at) VALUES (@dispute_id, @issue_number, @reason, @status, @created_at)');
      
    // Update citation status to purely indicate it has a dispute
    await pool.request()
      .input('id', issue_number)
      .query("UPDATE citations SET status = 'Disputed' WHERE issue_number = @id");

    res.status(201).json({ success: true, dispute: { dispute_id, issue_number, reason, status: 'Pending', created_at } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
