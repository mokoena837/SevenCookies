import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Import your product images
import product1 from '../assets/images/products/002.JPG';
import product2 from '../assets/images/products/003.JPG';
import product3 from '../assets/images/products/004.JPG';
import product4 from '../assets/images/products/005.JPG';
import product5 from '../assets/images/products/006.JPG';
import product6 from '../assets/images/products/007.JPG';
import product7 from '../assets/images/products/008.PNG';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Format price to South African Rand
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get product image based on product ID (7-13)
  const getProductImage = (productName, productId) => {
    // Map based on your actual product IDs (7-13)
    const imageMap = {
      7: product1,   // Gourmet Cookies → 002.JPG
      8: product2,   // Strawberry Shortcake → 003.JPG
      9: product3,   // Double Chocolate Chunk → 004.JPG
      10: product4,  // Birthday Cake → 005.JPG
      11: product5,  // Lemon Crinkle → 006.JPG
      12: product6,  // Salted Caramel Pecan → 007.JPG
      13: product7,  // Vanilla → 008.PNG
    };
    
    // If we have the product ID in the map, use it
    if (imageMap[productId]) {
      return imageMap[productId];
    }
    
    // Fallback: Map based on product name
    if (productName?.toLowerCase().includes('gourmet')) return product1;
    if (productName?.toLowerCase().includes('strawberry shortcake')) return product2;
    if (productName?.toLowerCase().includes('double chocolate')) return product3;
    if (productName?.toLowerCase().includes('birthday')) return product4;
    if (productName?.toLowerCase().includes('lemon')) return product5;
    if (productName?.toLowerCase().includes('salted caramel')) return product6;
    if (productName?.toLowerCase().includes('vanilla')) return product7;
    
    // Default image if no match
    return product1;
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}> Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Looks like you haven't added any cookies yet!</p>
        <Link to="/products" style={{
          backgroundColor: '#020202',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#080808'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#000000e1'}>
           Browse Our Cookies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
         Shopping Cart
      </h1>
      
      <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {/* Cart Items Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '100px 2fr 1.5fr 1.5fr 80px', 
          paddingBottom: '0.5rem', 
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 'bold',
          color: '#4b5563'
        }}>
          <div>Image</div>
          <div>Product</div>
          <div style={{ textAlign: 'center' }}>Quantity</div>
          <div style={{ textAlign: 'right' }}>Subtotal</div>
          <div></div>
        </div>
        
        {/* Cart Items */}
        {cart.items.map(item => (
          <div key={item.product_id} style={{ 
            display: 'grid', 
            gridTemplateColumns: '100px 2fr 1.5fr 1.5fr 80px', 
            alignItems: 'center', 
            borderBottom: '1px solid #e5e7eb', 
            padding: '1rem 0',
            transition: 'background-color 0.3s'
          }}>
            {/* Product Image */}
            <div>
              <img 
                src={getProductImage(item.name, item.product_id)}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 'bold' }}>{item.name}</h3>
              <p style={{ color: '#000000', fontSize: '0.9rem', fontWeight: '500' }}>{formatPrice(item.price)} each</p>
            </div>
            
            {/* Quantity Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value);
                  if (newQty > 0) {
                    updateQuantity(item.product_id, newQty);
                  }
                }}
                style={{ 
                  width: '60px', 
                  padding: '0.375rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '0.375rem',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                +
              </button>
            </div>
            
            {/* Subtotal */}
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: '#000000' }}>
              {formatPrice(item.price * item.quantity)}
            </div>
            
            {/* Remove Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => removeFromCart(item.product_id)}
                style={{
                  color: '#dc2626',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        
        {/* Cart Summary */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Total items: {cart.items.reduce((count, item) => count + item.quantity, 0)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                Total: <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#000000' }}>
                  {formatPrice(getCartTotal())}
                </span>
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
            <Link 
              to="/products"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s',
                textAlign: 'center',
                flex: 1,
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
               Continue Shopping
            </Link>
            
            <button
              onClick={() => navigate('/checkout')}
              style={{
                backgroundColor: '#ec489a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                flex: 1,
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#db2777';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ec489a';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;