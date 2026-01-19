'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Scrollbar from '@/components/scrollbar/scrollbar';
import { useCart, Order } from '@/contexts/CartContext';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';
import Image from 'next/image';

const OrderConfirmationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { getOrderById } = useCart();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = params?.orderId as string;
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Order not found, redirect to home
        router.push('/');
      }
      setLoading(false);
    }
  }, [params, getOrderById, router]);

  if (loading) {
    return (
      <Fragment>
        <div className='body_wrap sco_agency'>
          <Header />
          <main className="page_content">
            <section className="service pt-140 pb-140">
              <div className="container">
                <div className="row">
                  <div className="col-12 text-center">
                    <p className="content">Loading order details...</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <Scrollbar />
        </div>
      </Fragment>
    );
  }

  if (!order) {
    return null;
  }

  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Fragment>
      <div className='body_wrap sco_agency'>
        <Header />
        <main className="page_content">
          <section className="service pt-140 pb-140">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <Fade direction="up" triggerOnce duration={1000}>
                    <div className="text-center mb-60">
                      {order.status === 'completed' ? (
                        <>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#d4edda',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            fontSize: '40px',
                            color: '#28a745'
                          }}>
                            <i className="fas fa-check"></i>
                          </div>
                          <h1 className="title mb-20">Order Confirmed!</h1>
                          <p className="content" style={{ fontSize: '18px' }}>
                            Thank you for your purchase. Your order has been successfully placed.
                          </p>
                        </>
                      ) : (
                        <>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#f8d7da',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            fontSize: '40px',
                            color: '#dc3545'
                          }}>
                            <i className="fas fa-times"></i>
                          </div>
                          <h1 className="title mb-20">Payment Failed</h1>
                          <p className="content" style={{ fontSize: '18px' }}>
                            Unfortunately, your payment could not be processed. Please try again.
                          </p>
                        </>
                      )}
                    </div>
                  </Fade>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-8">
                  <Fade direction="left" triggerOnce duration={1000}>
                    <div className="order-details-card" style={{
                      padding: '40px',
                      backgroundColor: '#fff',
                      borderRadius: '15px',
                      border: '1px solid #e7e8ec',
                      marginBottom: '30px'
                    }}>
                      <h3 className="mb-30" style={{ fontSize: '24px', marginBottom: '30px' }}>
                        Order Details
                      </h3>

                      <div className="order-info mb-30">
                        <div style={{ marginBottom: '20px' }}>
                          <strong>Order ID:</strong> {order.orderId}
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <strong>Order Date:</strong> {orderDate}
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <strong>Status:</strong>{' '}
                          <span style={{
                            padding: '5px 15px',
                            borderRadius: '5px',
                            backgroundColor: order.status === 'completed' ? '#d4edda' : '#f8d7da',
                            color: order.status === 'completed' ? '#155724' : '#721c24',
                            fontSize: '14px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="order-items mb-30">
                        <h4 className="mb-20" style={{ fontSize: '20px', marginBottom: '20px' }}>
                          Items Ordered
                        </h4>
                        {order.items.map((item) => {
                          const mainImage = typeof item.images[0] === 'string'
                            ? item.images[0]
                            : item.images[0].src || item.images[0];

                          return (
                            <div key={item.Id} style={{
                              display: 'flex',
                              gap: '20px',
                              marginBottom: '20px',
                              paddingBottom: '20px',
                              borderBottom: '1px solid #e7e8ec'
                            }}>
                              <div style={{
                                position: 'relative',
                                width: '80px',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                backgroundColor: '#f6f6f8'
                              }}>
                                <Image
                                  src={mainImage}
                                  alt={item.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <h5 style={{ fontSize: '16px', marginBottom: '5px', fontWeight: '600' }}>
                                  {item.title}
                                </h5>
                                <p style={{ fontSize: '14px', color: 'var(--color-default)', marginBottom: '5px' }}>
                                  Quantity: {item.quantity}
                                </p>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-primary-two)' }}>
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="shipping-info">
                        <h4 className="mb-20" style={{ fontSize: '20px', marginBottom: '20px' }}>
                          Shipping Address
                        </h4>
                        <p style={{ lineHeight: '1.8' }}>
                          {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
                          {order.customerInfo.address}<br />
                          {order.customerInfo.city}, {order.customerInfo.zipCode}<br />
                          {order.customerInfo.country}<br />
                          Phone: {order.customerInfo.phone}
                        </p>
                      </div>
                    </div>
                  </Fade>
                </div>

                <div className="col-lg-4">
                  <Fade direction="right" triggerOnce duration={1000}>
                    <div className="order-summary-card" style={{
                      padding: '30px',
                      backgroundColor: '#fff',
                      borderRadius: '15px',
                      border: '1px solid #e7e8ec',
                      position: 'sticky',
                      top: '100px'
                    }}>
                      <h3 className="mb-30" style={{ fontSize: '24px', marginBottom: '30px' }}>
                        Order Summary
                      </h3>

                      <div className="summary-row mb-15" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px'
                      }}>
                        <span>Subtotal:</span>
                        <span style={{ fontWeight: '600' }}>₹{order.subtotal.toFixed(2)}</span>
                      </div>

                      <div className="summary-row mb-15" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px'
                      }}>
                        <span>Tax:</span>
                        <span style={{ fontWeight: '600' }}>₹{order.tax.toFixed(2)}</span>
                      </div>

                      <div className="summary-row mb-15" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px'
                      }}>
                        <span>Shipping:</span>
                        <span style={{ fontWeight: '600' }}>
                          {order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="summary-row mb-30" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '2px solid #e7e8ec',
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--color-heading)'
                      }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--color-primary-two)' }}>
                          ₹{order.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="payment-method mb-30" style={{ marginBottom: '30px' }}>
                        <strong>Payment Method:</strong>{' '}
                        <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                      </div>

                      <div className="order-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Link
                          href="/products"
                          className="thm-btn thm-btn--aso thm-btn--aso_yellow"
                          style={{ width: '100%', textAlign: 'center' }}
                        >
                          Continue Shopping
                        </Link>
                        {order.status === 'failed' && (
                          <Link
                            href="/cart"
                            className="thm-btn thm-btn--border"
                            style={{ width: '100%', textAlign: 'center' }}
                          >
                            Try Again
                          </Link>
                        )}
                      </div>
                    </div>
                  </Fade>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <Scrollbar />
      </div>
    </Fragment>
  );
};

export default OrderConfirmationPage;

