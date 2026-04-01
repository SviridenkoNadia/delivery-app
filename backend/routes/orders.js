const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders — create new order
router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    const { name, email, phone, address, items } = req.body;

    // Basic validation
    if (!name || !email || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (name, email, phone, address, total_price) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [name, email, phone, address, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1,$2,$3,$4,$5)',
        [orderId, item.productId, item.productName, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// GET /api/orders?email=...&phone=... — find orders by email+phone
router.get('/', async (req, res) => {
  try {
    const { email, phone } = req.query;
    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    const ordersResult = await db.query(
      'SELECT * FROM orders WHERE email=$1 AND phone=$2 ORDER BY created_at DESC',
      [email, phone]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await db.query(
          'SELECT * FROM order_items WHERE order_id=$1',
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;