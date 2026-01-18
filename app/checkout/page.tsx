'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Scrollbar from '@/components/scrollbar/scrollbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { Address } from '@/types';
import { Fade } from 'react-awesome-reveal';

const CheckoutPage: React.FC = () => {
  const { user, isLoading: authLoading } = useUser();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping for now
  const tax = 0;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?next=/checkout');
    } else if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      // Auto-select default address
      const defaultAddr = data.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    }
    setLoadingAddresses(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }
    setPlacingOrder(true);

    try {
      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          address_id: selectedAddressId,
          total_amount: total,
          status: 'pending',
          payment_method: 'cod' // Assuming COD for now
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.Id, // Assuming 'Id' is the product ID in cart item
        product_title: item.title,
        quantity: item.quantity,
        price: item.price,
        image_url: item.images?.[0]
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear Cart & Redirect
      clearCart();
      router.push('/profile?tab=orders'); // Go to orders tab
      // Ideally show a success message or separate success page

    } catch (err: any) {
      console.error('Order placement failed:', err);
      alert('Failed to place order: ' + (err.message || 'Unknown error'));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading) return null;

  if (cart.length === 0) {
    return (
      <div className="body_wrap">
        <Header />
        <main className="checkout-container">
          <div className="container empty-cart-state">
            <h2>Your cart is empty</h2>
            <p>Add some items before checking out.</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="body_wrap">
      <Header />
      <main className="checkout-container">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 20px 80px' }}>
          <h1 className="page-title">Checkout</h1>

          <div className="row g-5">
            {/* Left Column: Address */}
            <div className="col-lg-8">
              <section className="checkout-section">
                <div className="section-header">
                  <h3><i className="fas fa-map-marker-alt"></i> Delivery Address</h3>
                  <Link href="/account/addresses/add" className="add-new-link">
                    + Add New
                  </Link>
                </div>

                {loadingAddresses ? (
                  <div className="p-4 text-center">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="no-addresses">
                    <p>No addresses found. Please add a delivery address.</p>
                    <Link href="/account/addresses/add" className="btn-secondary">
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="address-list">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        className={`address-radio-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div className="radio-indicator">
                          <div className="dot"></div>
                        </div>
                        <div className="addr-details">
                          <div className="d-flex gap-2 align-items-center mb-1">
                            <strong>{addr.full_name}</strong>
                            <span className="badge-pill">{addr.phone}</span>
                            {addr.is_default && <span className="badge-default">Default</span>}
                          </div>
                          <p>
                            {addr.address_line1}, {addr.address_line2}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="checkout-section mt-4">
                <div className="section-header">
                  <h3><i className="fas fa-credit-card"></i> Payment Method</h3>
                </div>
                <div className="payment-option selected">
                  <div className="radio-indicator"><div className="dot"></div></div>
                  <span>Cash on Delivery (COD)</span>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary-card sticky-top" style={{ top: '120px' }}>
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cart.map((item, idx) => (
                    <div key={idx} className="summary-item">
                      <span className="name">{item.title} <small>x{item.quantity}</small></span>
                      <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-green">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddressId}
                >
                  {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
                <p className="secure-text"><i className="fas fa-lock"></i> Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Scrollbar />

      <style jsx>{`
                .checkout-container {
                    background-color: #f8fafc;
                    min-height: 100vh;
                }
                .page-title {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 40px;
                    color: #1e293b;
                }
                .empty-cart-state {
                    text-align: center;
                    padding: 100px 20px;
                }
                
                .checkout-section {
                    background: #fff;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .section-header h3 {
                    font-size: 20px;
                    font-weight: 700;
                    color: #334155;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0;
                }
                .add-new-link {
                    color: #2563eb;
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 14px;
                }

                .address-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .address-radio-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .address-radio-card.selected {
                    border-color: #2563eb;
                    background-color: #eff6ff;
                }
                .radio-indicator {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 2px;
                    flex-shrink: 0;
                }
                .address-radio-card.selected .radio-indicator {
                    border-color: #2563eb;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #2563eb;
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all 0.2s;
                }
                .address-radio-card.selected .dot {
                    opacity: 1;
                    transform: scale(1);
                }
                .addr-details p {
                    margin: 0;
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .badge-pill {
                    background: #f1f5f9;
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: #475569;
                }
                .badge-default {
                    background: #dbeafe;
                    color: #1e40af;
                    font-size: 10px;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 700;
                }

                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-weight: 500;
                }
                .payment-option.selected {
                    border-color: #2563eb;
                    background: #eff6ff;
                    color: #1e3a8a;
                }

                .order-summary-card {
                    background: #fff;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
                }
                .order-summary-card h3 {
                    font-size: 20px;
                    margin-bottom: 24px;
                    font-weight: 700;
                }
                .summary-items {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #475569;
                }
                .summary-divider {
                    height: 1px;
                    background: #e2e8f0;
                    margin: 16px 0;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    color: #64748b;
                }
                .summary-row.total {
                    color: #0f172a;
                    font-weight: 700;
                    font-size: 18px;
                    margin-top: 8px;
                }
                .text-green { color: #16a34a; font-weight: 600; }

                .place-order-btn {
                    width: 100%;
                    background: #000;
                    color: #fff;
                    padding: 16px;
                    border: none;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 700;
                    margin-top: 24px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .place-order-btn:hover:not(:disabled) {
                    background: #333;
                    transform: translateY(-2px);
                }
                .place-order-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .secure-text {
                    text-align: center;
                    color: #94a3b8;
                    font-size: 12px;
                    margin-top: 16px;
                    margin-bottom: 0;
                }
                .btn-primary {
                    background: #2563eb;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 50px;
                    text-decoration: none;
                    margin-top: 20px;
                    display: inline-block;
                }
                .btn-secondary {
                    background: #f1f5f9;
                    color: #475569;
                    padding: 8px 16px;
                    border-radius: 6px;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                }
                @media (max-width: 991px) {
                    .order-summary-card { margin-top: 30px; }
                }
            `}</style>
    </div>
  );
};

export default CheckoutPage;
