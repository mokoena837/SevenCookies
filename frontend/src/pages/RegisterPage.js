import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/images/001.PNG';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      overflow: 'auto'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1
      }}></div>
      
      {/* Register Form Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.5rem', 
            padding: '2rem', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Register</h1>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
              />
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: loading ? '#9ca3af' : '#ec489a',
                  color: 'white',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#db2777';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#ec489a';
                }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              Already have an account? <Link to="/login" style={{ color: '#ec489a' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;