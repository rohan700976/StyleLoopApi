const express = require('express');
const router = express.Router();
const redis = require('../client');

// Get all data from a table
router.get('/:tablename', async (req, res) => {
  try {
    const db = req.app.get('db');
    const tablename = req.params.tablename;

    const cached = await redis.get(tablename);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    db.query(`SELECT * FROM ${tablename}`, async (err, results) => {
      if (err) return res.status(500).json({ error: 'Query failed' });

      await redis.set(tablename, JSON.stringify(results));
      res.json(results);
    });
  } catch (err) {
    console.log("server error", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get data by ID
router.get('/:tablename/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { tablename, id } = req.params;
    const cacheKey = `${tablename}:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    db.query(`SELECT * FROM ${tablename} WHERE Product_id = ?`, [id], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Query failed' });
      if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

      await redis.set(cacheKey, JSON.stringify(results));
      res.json(results);
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get data by Fabric
router.get('/:tablename/fabric/:fabric', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { tablename, fabric } = req.params;
    const cacheKey = `${tablename}:fabric:${fabric}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    db.query(`SELECT * FROM ${tablename} WHERE Fabric = ?`, [fabric], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Query failed' });
      if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

      await redis.set(cacheKey, JSON.stringify(results));
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get data by Occasion
router.get('/:tablename/occasion/:occasion', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { tablename, occasion } = req.params;
    const cacheKey = `${tablename}:occasion:${occasion}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    db.query(`SELECT * FROM ${tablename} WHERE Occasion = ?`, [occasion], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Query failed' });
      if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

      await redis.set(cacheKey, JSON.stringify(results));
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get data by Rating
router.get('/:tablename/rating/:rating', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { tablename, rating } = req.params;
    const parsedRating = parseFloat(rating);
    const lower = parsedRating - 0.01;
    const upper = parsedRating + 0.01;
    const cacheKey = `${tablename}:rating:${rating}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    db.query(
      `SELECT * FROM ${tablename} WHERE Rating BETWEEN ? AND ?`,
      [lower, upper],
      async (err, results) => {
        if (err) return res.status(500).json({ error: 'Query failed' });
        if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

        await redis.set(cacheKey, JSON.stringify(results));
        res.json(results);
      }
    );
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
