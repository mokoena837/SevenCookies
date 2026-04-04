const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'seven',
    database: process.env.DB_NAME || 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create products table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50),
                stock INT DEFAULT 0,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create cart table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY unique_cart_item (user_id, product_id)
            )
        `);
        
        // Create orders table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                shipping_address TEXT,
                payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                order_status ENUM('processing', 'shipped', 'delivered') DEFAULT 'processing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Create order_items table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        
        // Check if products exist
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
        
        if (rows[0].count === 0) {
            // Insert sample products
            await connection.query(`
                INSERT INTO products (name, description, price, category, stock, image_url) VALUES
                ('Laptop', 'High performance laptop for work and gaming', 999.99, 'Electronics', 10, 'https://via.placeholder.com/300'),
                ('Smartphone', 'Latest model with amazing camera', 699.99, 'Electronics', 15, 'https://via.placeholder.com/300'),
                ('Headphones', 'Wireless noise-cancelling headphones', 199.99, 'Electronics', 20, 'https://via.placeholder.com/300'),
                ('T-Shirt', 'Comfortable cotton t-shirt', 24.99, 'Clothing', 50, 'https://via.placeholder.com/300'),
                ('Jeans', 'Classic blue denim jeans', 59.99, 'Clothing', 30, 'https://via.placeholder.com/300'),
                ('Coffee Maker', 'Automatic coffee maker', 89.99, 'Home', 12, 'https://via.placeholder.com/300')
            `);
            console.log('Sample products inserted');
        }
        
        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error.message);
    }
};

initDatabase();

module.exports = pool;