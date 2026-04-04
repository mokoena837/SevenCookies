const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        let params = [];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;