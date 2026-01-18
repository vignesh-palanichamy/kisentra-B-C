'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Scrollbar from '@/components/scrollbar/scrollbar';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';
import Image from 'next/image';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Check if we have a session. If not, the link might be invalid or expired.
        // However, with PKCE flow, the code exchange might happen just before this page renders.
        // We'll give it a moment or check session.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // We might be here but lost session, or arrived without code exchange?
                // Let's assume valid flow for now, but warn if no user found on submit.
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/auth');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='body_wrap'>
            <Header />
            <style jsx global>{`
        .auth-container-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            padding: 140px 20px 80px;
        }
        .auth-card {
            display: flex;
            width: 100%;
            max-width: 1100px;
            background-color: #fff;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            min-height: 600px;
        }
        .auth-left {
            flex: 1;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            padding: 60px;
            position: relative;
            overflow: hidden;
        }
        .auth-left::before {
            content: '';
            position: absolute;
            top: -100px;
            right: -100px;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .auth-left::after {
            content: '';
            position: absolute;
            bottom: -50px;
            left: -50px;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
        }

        .auth-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            background-color: #fff;
        }
        .auth-form-container {
            width: 100%;
            max-width: 400px;
        }
        .input-group-pill {
            margin-bottom: 24px;
        }
        .input-group-pill label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-left: 12px;
        }
        .input-field-pill {
            width: 100%;
            padding: 16px 24px;
            border-radius: 50px; 
            border: 1px solid #dbeafe;
            background-color: #eff6ff !important;
            font-size: 15px;
            color: #1e293b;
            outline: none;
            transition: all 0.2s ease;
        }
        .input-field-pill:hover {
            background-color: #dbeafe !important;
            border-color: #93c5fd;
        }
        .input-field-pill:focus {
            background-color: #fff !important;
            border-color: var(--color-primary-two);
            box-shadow: 0 0 0 4px rgba(var(--color-primary-two-rgb, 54, 147, 217), 0.1);
        }
        .btn-pill {
            width: 100%;
            padding: 16px;
            border-radius: 50px;
            border: none;
            background: linear-gradient(90deg, var(--color-primary-two) 0%, #2563eb 100%);
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
        }
        .btn-pill:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3);
        }
        .btn-pill:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        @media (max-width: 991px) {
            .auth-card {
                flex-direction: column;
                max-width: 500px;
            }
            .auth-left {
                display: none;
            }
            .auth-right {
                padding: 40px 30px;
            }
        }
      `}</style>

            <main className="auth-container-wrapper">
                <Fade direction="up" triggerOnce duration={400} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="auth-card">
                        {/* Left Side - Visual */}
                        <div className="auth-left">
                            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '80%' }}>
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '24px',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '20px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transform: 'rotate(-5deg)'
                                    }}>
                                        <div style={{
                                            transform: 'rotate(5deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <i className="fas fa-key fa-3x" style={{
                                                color: '#fff',
                                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                                            }}></i>
                                        </div>
                                    </div>
                                </div>

                                <h1 style={{
                                    fontSize: '42px',
                                    fontWeight: '800',
                                    marginBottom: '24px',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                    color: '#ffffff',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                    Reset Password
                                </h1>
                                <p style={{
                                    fontSize: '18px',
                                    color: '#e2e8f0',
                                    lineHeight: 1.6,
                                    maxWidth: '320px',
                                    margin: '0 auto',
                                    fontWeight: '400'
                                }}>
                                    Create a new strong password for your account to keep it secure.
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="auth-right">
                            <div className="auth-form-container">
                                <div style={{ marginBottom: '40px' }}>
                                    <Link href="/">
                                        <Image src="/images/logo/logo-black.svg" alt="Logo" width={140} height={40} style={{ height: 'auto', marginBottom: '30px' }} />
                                    </Link>
                                    <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                                        New Password
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '16px' }}>
                                        Please enter your new password below.
                                    </p>
                                </div>

                                <form onSubmit={handleUpdatePassword}>
                                    <div className="input-group-pill">
                                        <label>New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                placeholder="New password"
                                                className="input-field-pill"
                                                style={{ paddingRight: '50px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '20px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94a3b8',
                                                    padding: '4px',
                                                    display: 'flex'
                                                }}
                                            >
                                                <i className={`far fa-eye${showPassword ? '-slash' : ''}`} style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="input-group-pill">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            placeholder="Confirm new password"
                                            className="input-field-pill"
                                        />
                                    </div>

                                    {(error || message) && (
                                        <div style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            backgroundColor: error ? '#fef2f2' : '#f0fdf4',
                                            color: error ? '#991b1b' : '#166534',
                                            border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`,
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'start',
                                            marginBottom: '30px'
                                        }}>
                                            <div style={{ marginTop: '2px' }}>
                                                <i className={`fas fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                {error || message}
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn-pill" type="submit" disabled={loading}>
                                        {loading ? (
                                            <span><i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i> Updating...</span>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Fade>
            </main>
            <Footer />
            <Scrollbar />
        </div>
    );
};

export default ResetPasswordPage;
