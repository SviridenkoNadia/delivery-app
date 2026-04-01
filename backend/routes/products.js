const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products?shopId=1&category=Burgers&sort=price_asc
router.get('/', async (req, res) => {
  try {
    const { shopId, category, sort } = req.query;

    if (!shopId) return res.status(400).json({ error: 'shopId is required' });

    let query = 'SELECT * FROM products WHERE shop_id = $1';
    const params = [shopId];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    // Sorting
    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'name_asc') query += ' ORDER BY name ASC';
    else query += ' ORDER BY id ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/categories?shopId=1 — get unique categories for a shop
router.get('/categories', async (req, res) => {
  try {
    const { shopId } = req.query;
    if (!shopId) return res.status(400).json({ error: 'shopId is required' });

    const result = await db.query(
      'SELECT DISTINCT category FROM products WHERE shop_id = $1 ORDER BY category',
      [shopId]
    );
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;