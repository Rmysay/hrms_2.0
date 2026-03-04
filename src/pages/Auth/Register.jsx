import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Building2, Briefcase, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { registerUser, clearError } from '../../store/authSlice';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        department: '',
        title: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form));
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px 10px 38px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'rgba(148, 163, 184, 0.04)',
        color: 'var(--color-text-primary)',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color var(--transition-fast)',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        marginBottom: '6px',
    };

    const iconStyle = {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-text-muted)',
    };

    const renderInput = (label, name, icon, type = 'text', placeholder = '', required = true) => {
        const Icon = icon;
        return (
            <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                    <Icon size={16} style={iconStyle} />
                    {name === 'password' ? (
                        <>
                            <input
                                id={`register-${name}`}
                                type={showPassword ? 'text' : type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                required={required}
                                style={{ ...inputStyle, paddingRight: '40px' }}
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
                        </>
                    ) : (
                        <input
                            id={`register-${name}`}
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            required={required}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    )}
                </div>
            </div>
        );
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
            padding: '20px 0',
        }}>
            {/* Background Orbs */}
            <div className="glow-orb" style={{
                width: '400px', height: '400px',
                background: 'var(--color-accent-secondary)',
                top: '-60px', left: '-60px',
                position: 'absolute',
            }} />
            <div className="glow-orb" style={{
                width: '350px', height: '350px',
                background: 'var(--color-accent-primary)',
                bottom: '-50px', right: '-50px',
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
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-primary))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '14px',
                    }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                    }}>
                        Hesap Oluştur
                    </h1>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem',
                        marginTop: '6px',
                    }}>
                        IKDS'ye katılmak için kaydolun
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card" style={{ padding: '28px' }}>
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
                                    marginBottom: '16px',
                                }}
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        {/* Name Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {renderInput('Ad', 'firstName', User, 'text', 'Adınız')}
                            {renderInput('Soyad', 'lastName', User, 'text', 'Soyadınız')}
                        </div>

                        {renderInput('E-posta', 'email', Mail, 'email', 'ornek@sirket.com')}
                        {renderInput('Şifre', 'password', Lock, 'password', 'En az 6 karakter')}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {renderInput('Departman', 'department', Building2, 'text', 'Örn: IT', false)}
                            {renderInput('Ünvan', 'title', Briefcase, 'text', 'Örn: Uzman', false)}
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
                                marginTop: '6px',
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
                                    Kayıt yapılıyor...
                                </span>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Kayıt Ol
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '18px',
                        paddingTop: '18px',
                        borderTop: '1px solid var(--color-border)',
                    }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            Zaten hesabınız var mı?{' '}
                            <Link to="/login" style={{
                                color: 'var(--color-accent-primary)',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
