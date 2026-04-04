const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get cart
router.get('/', auth, async (req, res) => {
    try {
        const [cart] = await db.query(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );
        
        res.json({ items: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        // Check if product exists
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if item already in cart
        const [existing] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [req.userId, productId]
        );
        
        if (existing.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.userId, productId]
            );
        } else {
            // Add new item
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.userId, productId, quantity]
            );
        }
        
        // Get updated cart
        const [cart] = await db.query(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );
        
        res.json({ items: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item
router.put('/update/:productId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (quantity <= 0) {
            await db.query(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [req.userId, req.params.productId]
            );
        } else {
            await db.query(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.userId, req.params.productId]
            );
        }
        
        const [cart] = await db.query(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );
        
        res.json({ items: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [req.userId, req.params.productId]
        );
        
        const [cart] = await db.query(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );
        
        res.json({ items: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;