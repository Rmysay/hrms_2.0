import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { loginUser, clearError } from '../../store/authSlice';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-primary)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Orbs */}
            <div className="glow-orb" style={{
                width: '500px', height: '500px',
                background: 'var(--color-accent-primary)',
                top: '-100px', right: '-100px',
                position: 'absolute',
            }} />
            <div className="glow-orb" style={{
                width: '400px', height: '400px',
                background: 'var(--color-accent-secondary)',
                bottom: '-80px', left: '-80px',
                position: 'absolute',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '0 20px',
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                    }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                    }}>
                        IKDS'ye Hoş Geldiniz
                    </h1>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem',
                        marginTop: '6px',
                    }}>
                        Devam etmek için giriş yapın
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#f87171',
                                    fontSize: '0.85rem',
                                    marginBottom: '20px',
                                }}
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                marginBottom: '6px',
                            }}>
                                E-posta
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                }} />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@sirket.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 38px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border)',
                                        background: 'rgba(148, 163, 184, 0.04)',
                                        color: 'var(--color-text-primary)',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                marginBottom: '6px',
                            }}>
                                Şifre
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                }} />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 40px 10px 38px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border)',
                                        background: 'rgba(148, 163, 184, 0.04)',
                                        color: 'var(--color-text-primary)',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '0.9rem',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                                    />
                                    Giriş yapılıyor...
                                </span>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Giriş Yap
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Register Link */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--color-border)',
                    }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            Hesabınız yok mu?{' '}
                            <Link to="/register" style={{
                                color: 'var(--color-accent-primary)',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
