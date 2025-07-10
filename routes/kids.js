const express = require('express');
const router = express.Router();

// Get all users (men shirts)
router.get('/:tablename', (req, res) => {
  const db = req.app.get('db');

  db.query(`SELECT * FROM ${req.params.tablename}`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }
    res.json(results);
  });
});

// Get user by ID
router.get('/:tablename/:id', (req, res) => {
  const db = req.app.get('db'); // ✅ Access db again
  const id = req.params.id;

  db.query(`SELECT * FROM ${req.params.tablename} WHERE Product_id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results);
  });
});

router.get('/:tablename/fabric/:fabric', (req, res) => {
  const db = req.app.get('db'); // ✅ Access db again
  const fabric = req.params.fabric;

  db.query(`SELECT * FROM ${req.params.tablename} WHERE Fabric= ?`, [fabric], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results);
  });
});

router.get('/:tablename/occasion/:occasion',(req,res)=>{
    const db=req.app.get('db')
    const occasion=req.params.occasion;
   db.query(`SELECT * FROM ${req.params.tablename} WHERE Occasion= ?`, [occasion], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results);
  });
});

router.get('/:tablename/rating/:rating',(req,res)=>{
  const db=req.app.get('db')
   const rating = parseFloat(req.params.rating);
const lowerBound = rating - 0.01;
const upperBound = rating + 0.01;

db.query(
  `SELECT * FROM ${req.params.tablename} WHERE Rating BETWEEN ? AND ?`,
  [lowerBound, upperBound],
  (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results);
});

});


module.exports = router;
