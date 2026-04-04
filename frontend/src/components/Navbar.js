import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#f104aa',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.0rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
            Seven cokies Shop
          </Link>
          
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
            
            {user ? (
              <>
                <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
                  Cart
                  {getCartCount() > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-12px',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      padding: '0 5px',
                      fontSize: '12px'
                    }}>
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;