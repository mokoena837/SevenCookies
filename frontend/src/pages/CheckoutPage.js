import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Import your product images for order summary
import product1 from '../assets/images/products/002.JPG';
import product2 from '../assets/images/products/003.JPG';
import product3 from '../assets/images/products/004.JPG';
import product4 from '../assets/images/products/005.JPG';
import product5 from '../assets/images/products/006.JPG';
import product6 from '../assets/images/products/007.JPG';
import product7 from '../assets/images/products/008.PNG';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'South Africa'
  });
  
  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Format price to South African Rand
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get product image for order summary - FIXED with IDs 7-13
  const getProductImage = (productName, productId) => {
    const imageMap = {
      7: product1,   // Gourmet Cookies → 002.JPG
      8: product2,   // Strawberry Shortcake → 003.JPG
      9: product3,   // Double Chocolate Chunk → 004.JPG
      10: product4,  // Birthday Cake → 005.JPG
      11: product5,  // Lemon Crinkle → 006.JPG
      12: product6,  // Salted Caramel Pecan → 007.JPG
      13: product7,  // Vanilla → 008.PNG
    };
    
    if (imageMap[productId]) return imageMap[productId];
    
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

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardDetails({ ...cardDetails, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setCardDetails({ ...cardDetails, [name]: formatExpiryDate(value) });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate card details if payment method is card
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!cardDetails.cardName) {
        toast.error('Please enter the name on card');
        return;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const shippingAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
      
      // Create order
      const orderResponse = await axios.post('http://localhost:5000/api/orders', {
        shippingAddress,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? {
          last4: cardDetails.cardNumber.slice(-4),
          cardType: cardDetails.cardNumber.startsWith('4') ? 'Visa' : 
                    cardDetails.cardNumber.startsWith('5') ? 'Mastercard' : 'Card'
        } : null
      });
      
      // Simulate payment
      await axios.post(`http://localhost:5000/api/orders/${orderResponse.data.orderId}/pay`);
      
      toast.success(`Order placed successfully! Payment via ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'}`);
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
        Checkout
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left Column - Shipping & Payment */}
          <div>
            {/* Shipping Address */}
            <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000000' }}>Shipping Address</h2>
              <input
                type="text"
                placeholder="Street Address"
                required
                value={address.street}
                onChange={(e) => setAddress({...address, street: e.target.value})}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              />
              <input
                type="text"
                placeholder="City"
                required
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              />
              <input
                type="text"
                placeholder="State/Province"
                required
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value})}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              />
              <input
                type="text"
                placeholder="Zip Code"
                required
                value={address.zipCode}
                onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={address.country}
                onChange={(e) => setAddress({...address, country: e.target.value})}
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              />
            </div>
            
            {/* Payment Method */}
            <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000000' }}>Payment Method</h2>
              
              {/* Payment Options */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: paymentMethod === 'card' ? '#ec489a' : '#f3f4f6',
                    color: paymentMethod === 'card' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 'bold'
                  }}
                >
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: paymentMethod === 'apple' ? '#000' : '#f3f4f6',
                    color: paymentMethod === 'apple' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 'bold'
                  }}
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: paymentMethod === 'google' ? '#4285f4' : '#f3f4f6',
                    color: paymentMethod === 'google' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 'bold'
                  }}
                >
                  Google Pay
                </button>
              </div>
              
              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number (1234 5678 9012 3456)"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    maxLength="19"
                    style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                  />
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on Card"
                    value={cardDetails.cardName}
                    onChange={handleCardInputChange}
                    style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      maxLength="5"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                    />
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      maxLength="4"
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                    />
                  </div>
                </div>
              )}
              
              {/* Apple/Google Pay Info */}
              {(paymentMethod === 'apple' || paymentMethod === 'google') && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <p style={{ color: '#666' }}>
                    You will be redirected to {paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'} to complete your payment securely.
                  </p>
                </div>
              )}
              
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
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#db2777';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#ec489a';
                }}
              >
                {loading ? 'Processing...' : `Pay ${formatPrice(getCartTotal() + (getCartTotal() * 0.15))}`}
              </button>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000000' }}>Order Summary</h2>
            
            {/* Order Items */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cart.items.map(item => (
                <div key={item.product_id} style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <img 
                    src={getProductImage(item.name, item.product_id)}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#000000' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping</span>
                <span style={{ color: '#10b981' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Tax (15% VAT)</span>
                <span>{formatPrice(getCartTotal() * 0.15)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span>Total</span>
                <span style={{ color: '#000000' }}>{formatPrice(getCartTotal() + (getCartTotal() * 0.15))}</span>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              textAlign: 'center',
              color: '#92400e'
            }}>
              Secure payment processing. Your information is encrypted.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;