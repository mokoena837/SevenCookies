import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Import your product images
import product1 from '../assets/images/products/002.JPG';
import product2 from '../assets/images/products/003.JPG';
import product3 from '../assets/images/products/004.JPG';
import product4 from '../assets/images/products/005.JPG';
import product5 from '../assets/images/products/006.JPG';
import product6 from '../assets/images/products/007.JPG';
import product7 from '../assets/images/products/008.PNG';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState(false);

  // Format price to South African Rand
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get product image
  const getProductImage = (productName, productId) => {
    const imageMap = {
      1: product1,
      2: product2,
      3: product3,
      4: product4,
      5: product5,
      6: product6,
      7: product7,
    };
    
    if (imageMap[productId]) return imageMap[productId];
    
    if (productName?.toLowerCase().includes('gourmet')) return product1;
    if (productName?.toLowerCase().includes('strawberry')) return product2;
    if (productName?.toLowerCase().includes('double chocolate')) return product3;
    if (productName?.toLowerCase().includes('birthday')) return product4;
    if (productName?.toLowerCase().includes('lemon')) return product5;
    if (productName?.toLowerCase().includes('salted caramel')) return product6;
    if (productName?.toLowerCase().includes('vanilla')) return product7;
    
    return product1;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get estimated delivery date
  const getEstimatedDelivery = (createdDate) => {
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('en-ZA');
  };

  // Track order function
  const trackOrder = (order) => {
    setSelectedOrder(order);
    setTrackingModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
        <a href="/products" style={{
          backgroundColor: '#eb25ca',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
        My Orders
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map(order => (
          <div key={order.id} style={{ 
            background: 'white', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            
            {/* Order Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Order #{order.id}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(order.created_at).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.85rem',
                  backgroundColor: order.payment_status === 'completed' ? '#d1fae5' : '#fef3c7',
                  color: order.payment_status === 'completed' ? '#065f46' : '#92400e',
                  marginRight: '0.5rem'
                }}>
                  {order.payment_status === 'completed' ? 'Paid' : 'Pending Payment'}
                </span>
                
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.85rem',
                  backgroundColor: `${getStatusColor(order.order_status)}20`,
                  color: getStatusColor(order.order_status)
                }}>
                  {order.order_status || 'Processing'}
                </span>
              </div>
            </div>
            
            {/* Order Items Preview */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {order.items && order.items.slice(0, 3).map((item, idx) => (
                  <img 
                    key={idx}
                    src={getProductImage(item.product_name, item.product_id)}
                    alt={item.product_name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                  />
                ))}
                {order.items && order.items.length > 3 && (
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#666'
                  }}>
                    +{order.items.length - 3}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold' }}>
                    {order.items && order.items.length} item(s)
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Total: {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Actions */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={() => trackOrder(order)}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                Track Order
              </button>
              
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setTrackingModal(true);
                }}
                style={{
                  backgroundColor: '#eb25b0',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Modal */}
      {trackingModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setTrackingModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Order #{selectedOrder.id}</h2>
              <button onClick={() => setTrackingModal(false)} style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}>×</button>
            </div>
            
            {/* Order Status Timeline */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Order Status</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
                  const statusIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.order_status);
                  const isCompleted = idx <= statusIndex;
                  const isCurrent = selectedOrder.order_status === status;
                  
                  return (
                    <div key={status} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: isCurrent ? '#2563eb' : '#666' }}>
                        {status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Order Details */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Items</h3>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <img 
                    src={getProductImage(item.product_name, item.product_id)}
                    alt={item.product_name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.5rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.product_name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Shipping Info */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Shipping Address</h3>
              <p style={{ color: '#666' }}>{selectedOrder.shipping_address}</p>
            </div>
            
            {/* Estimated Delivery */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Estimated Delivery</h3>
              <p style={{ color: '#666' }}>
                {selectedOrder.order_status === 'delivered' 
                  ? 'Delivered on ' + new Date(selectedOrder.updated_at).toLocaleDateString()
                  : getEstimatedDelivery(selectedOrder.created_at)}
              </p>
            </div>
            
            {/* Order Summary */}
            <div style={{ 
              borderTop: '2px solid #e5e7eb', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.total_amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping</span>
                <span style={{ color: '#10b981' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: '#141516' }}>{formatPrice(selectedOrder.total_amount)}</span>
              </div>
            </div>
            
            <button
              onClick={() => setTrackingModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#eb25c0',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginTop: '1rem',
                fontWeight: 'bold'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;