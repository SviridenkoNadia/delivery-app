const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/shops — get all shops, optional ?minRating=4.0&maxRating=5.0
router.get('/', async (req, res) => {
  try {
    const { minRating, maxRating } = req.query;
    let query = 'SELECT * FROM shops';
    const params = [];

    if (minRating !== undefined && maxRating !== undefined) {
      query += ' WHERE rating >= $1 AND rating <= $2';
      params.push(parseFloat(minRating), parseFloat(maxRating));
    }

    query += ' ORDER BY name ASC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;