const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { shippingAddress } = req.body;
        
        // Get cart items
        const [cart] = await connection.query(
            `SELECT c.product_id, c.quantity, p.price, p.stock 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );
        
        if (cart.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Cart is empty' });
        }
        
        // Check stock
        for (const item of cart) {
            if (item.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ message: 'Insufficient stock for some items' });
            }
        }
        
        // Calculate total
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order
        const [order] = await connection.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
            [req.userId, totalAmount, shippingAddress]
        );
        
        // Create order items and update stock
        for (const item of cart) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [order.insertId, item.product_id, item.quantity, item.price]
            );
            
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }
        
        // Clear cart
        await connection.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);
        
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Order created successfully',
            orderId: order.insertId,
            totalAmount 
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Get user orders
router.get('/', auth, async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, 
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('product_name', p.name, 'quantity', oi.quantity, 'price', oi.price)
                    ) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
             FROM orders o 
             WHERE o.user_id = ? 
             ORDER BY o.created_at DESC`,
            [req.userId]
        );
        
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Simulate payment
router.post('/:id/pay', auth, async (req, res) => {
    try {
        const [order] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );
        
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        await db.query(
            'UPDATE orders SET payment_status = "completed", order_status = "processing" WHERE id = ?',
            [req.params.id]
        );
        
        res.json({ 
            message: 'Payment successful',
            transactionId: `TXN_${Date.now()}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;