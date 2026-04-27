const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// Get User's Vehicles
router.get("/user/:userId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', req.params.userId)
      .query('SELECT * FROM vehicles WHERE user_id = @userId');
    
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Vehicle
router.post("/", async (req, res) => {
  try {
    const { license_number, user_id, state, type } = req.body;
    const pool = await poolPromise;
    
    await pool.request()
      .input('license_number', license_number)
      .input('user_id', user_id)
      .input('state', state)
      .input('type', type)
      .query('INSERT INTO vehicles (license_number, user_id, state, type) VALUES (@license_number, @user_id, @state, @type)');
      
    res.status(201).json({ success: true, vehicle: { license_number, user_id, state, type } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
