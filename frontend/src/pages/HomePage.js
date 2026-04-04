import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/001.PNG';

const HomePage = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Content Container - Positioned at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '3rem 2rem',
        background: 'linear-gradient(to top, rgba(196, 46, 163, 0.9), rgba(255, 87, 199, 0.81), transparent)'
      }}>
        {/* Shop Now Button */}
        <Link
          to="/products"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '1rem 2.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            fontFamily: 'monospace',
            display: 'inline-block',
            marginBottom: '2rem',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#02f32a';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Shop Now
        </Link>

        {/* About Section */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: 'rgba(204, 20, 189, 0.6)',
          borderRadius: '1rem',
          fontFamily: 'monospace',
          backdropFilter: 'blur(5px)'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: '#eee1e1',
            fontFamily: 'monospace'
          }}>
            Seven Flavors. One Perfect Bite.
          </h2>
          
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '1rem',
            fontFamily: 'monospace'
          }}>
            Seven Cookies was born from a passion to create the perfect cookie experience. 
            We offer <strong style={{ color: '#fbbf24' }}>seven unique flavors</strong> - each crafted to bring joy to your taste buds.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.5rem',
            margin: '1rem 0',
            textAlign: 'left'
          }}>
            <div> Classic Chocolate Chip</div>
            <div> Double Fudge Brownie</div>
            <div>Salted Caramel Swirl</div>
            <div> Nutty Pecan Bliss</div>
            <div> Strawberry Shortcake</div>
            <div> Matcha Green Tea</div>
            <div> Peanut Butter Paradise</div>
          </div>
          
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            fontFamily: 'monospace',
            fontStyle: 'italic',
            marginTop: '1rem',
            borderTop: '1px solid rgba(184, 28, 119, 0.8)',
            paddingTop: '1rem'
          }}>
             Made fresh daily with premium ingredients • Baked with love • Perfect for sharing 
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;