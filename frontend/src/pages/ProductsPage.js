import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Import your local product images
import product1 from '../assets/images/products/002.JPG';
import product2 from '../assets/images/products/003.JPG';
import product3 from '../assets/images/products/004.JPG';
import product4 from '../assets/images/products/005.JPG';
import product5 from '../assets/images/products/006.JPG';
import product6 from '../assets/images/products/007.JPG';
import product7 from '../assets/images/products/008.PNG';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  // Map local images to products based on your actual IDs (7-13)
  const getProductImage = (productId, productName) => {
    const imageMap = {
      7: product1,   // Gourmet Cookies → 002.JPG
      8: product2,   // Strawberry Shortcake → 003.JPG
      9: product3,   // Double Chocolate Chunk → 004.JPG
      10: product4,  // Birthday Cake → 005.JPG
      11: product5,  // Lemon Crinkle → 006.JPG
      12: product6,  // Salted Caramel Pecan → 007.JPG
      13: product7,  // Vanilla → 008.PNG
    };
    
    if (imageMap[productId]) {
      return imageMap[productId];
    }
    
    // Fallback based on product name
    if (productName?.toLowerCase().includes('gourmet')) return product1;
    if (productName?.toLowerCase().includes('strawberry shortcake')) return product2;
    if (productName?.toLowerCase().includes('double chocolate')) return product3;
    if (productName?.toLowerCase().includes('birthday')) return product4;
    if (productName?.toLowerCase().includes('lemon')) return product5;
    if (productName?.toLowerCase().includes('salted caramel')) return product6;
    if (productName?.toLowerCase().includes('vanilla')) return product7;
    
    return product1;
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const response = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Format price to South African Rand
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const categories = ['Gourmet', 'Strawberry', 'Chocolate', 'Birthday', 'Lemon', 'Caramel', 'Vanilla'];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
        Our Delicious Cookies
      </h1>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search cookies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
        >
          <option value="">All Flavors</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading delicious cookies...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'stretch'
        }}>
          {products.map(product => (
            <div key={product.id} style={{ 
              background: 'white', 
              borderRadius: '0.5rem', 
              overflow: 'hidden', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Image Container */}
              <div style={{
                width: '100%',
                height: '250px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={getProductImage(product.id, product.name)} 
                  alt={product.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    padding: '1rem'
                  }}
                />
              </div>
              
              {/* Content Container */}
              <div style={{ 
                padding: '1rem', 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4', flex: 1 }}>
                  {product.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: 'auto',
                  gap: '1rem'
                }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: '#000000'
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    style={{
                      backgroundColor: product.stock > 0 ? '#ec489a' : '#9ca3af',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      minWidth: '100px'
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock > 0) {
                        e.target.style.backgroundColor = '#db2777';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.stock > 0) {
                        e.target.style.backgroundColor = '#ec489a';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;