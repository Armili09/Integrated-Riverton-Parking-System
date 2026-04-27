const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Get User's Transactions (Permits & Citations)
router.get("/user/:userId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.params.userId;

    // 1. Get Permit Transactions
    const permitQuery = `
      SELECT pt.transaction_id, pt.amount, pt.transaction_datetime as date, 'Permit' as type, p.type as subtype, p.license_number
      FROM permit_transactions pt
      JOIN permits p ON pt.permit_id = p.permit_id
      JOIN vehicles v ON p.license_number = v.license_number
      WHERE v.user_id = @userId
    `;
    const permitRes = await pool.request()
      .input('userId', userId)
      .query(permitQuery);

    // 2. Get Citation Transactions
    const citationQuery = `
      SELECT ct.transaction_id, ct.amount, ct.c_transaction_datetime as date, 'Citation' as type, c.violation_code as subtype, c.license_number
      FROM citation_transactions ct
      JOIN citations c ON ct.issue_number = c.issue_number
      JOIN vehicles v ON c.license_number = v.license_number
      WHERE v.user_id = @userId
    `;
    const citationRes = await pool.request()
      .input('userId', userId)
      .query(citationQuery);

    // 3. Combine and sort
    let allTransactions = [...permitRes.recordset, ...citationRes.recordset];
    
    // Sort descending by date
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allTransactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
