const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/config");

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .input('password', password)
      .query('SELECT * FROM users WHERE email = @email AND password = @password');
    
    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Signup
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user_id = 'U' + Math.floor(Math.random() * 100000000).toString(); // simple ID gen
    
    const pool = await poolPromise;
    await pool.request()
      .input('user_id', user_id)
      .input('name', name)
      .input('email', email)
      .input('password', password)
      .query('INSERT INTO users (user_id, name, email, password) VALUES (@user_id, @name, @email, @password)');
      
    res.status(201).json({ success: true, user: { user_id, name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Detail
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT user_id, name, email FROM users WHERE user_id = @id');
      
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
