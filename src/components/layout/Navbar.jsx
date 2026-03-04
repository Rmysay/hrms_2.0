import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Target,
    Briefcase,
    Award,
    Bell,
    Search,
    Menu,
    X,
    Sparkles,
    LogOut
} from 'lucide-react';
import { logout } from '../../store/authSlice';

const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organization', label: 'Organizasyon', icon: Building2 },
    { path: '/talent', label: 'Yetenek', icon: Target },
    { path: '/recruitment', label: 'İşe Alma', icon: Briefcase },
    { path: '/performance', label: 'Performans', icon: Award },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const userInitials = user
        ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
        : 'İK';

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: 'rgba(10, 14, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
            }}
        >
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Sparkles size={18} color="white" />
                </div>
                <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                }}>
                    IKDS
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
                className="desktop-nav"
            >
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                transition: 'all var(--transition-fast)',
                                position: 'relative',
                            }}
                        >
                            <Icon size={16} />
                            <span>{link.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-1px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '20px',
                                        height: '2px',
                                        borderRadius: '1px',
                                        background: 'var(--color-accent-primary)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Search */}
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'rgba(148, 163, 184, 0.04)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    <Search size={14} />
                    <span className="desktop-nav" style={{ display: 'inline' }}>Ara...</span>
                    <kbd className="desktop-nav" style={{
                        display: 'inline',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.7rem',
                        color: 'var(--color-text-muted)',
                    }}>⌘K</kbd>
                </button>

                {/* Notifications */}
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    <Bell size={16} />
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--color-accent-primary)',
                        border: '2px solid var(--color-bg-primary)',
                    }} />
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Çıkış Yap"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    <LogOut size={16} />
                </button>

                {/* Avatar */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'white',
                    cursor: 'pointer',
                }}>
                    {userInitials}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-nav-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                    }}
                >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mobile-menu"
                    style={{
                        position: 'absolute',
                        top: '64px',
                        left: 0,
                        right: 0,
                        background: 'rgba(10, 14, 26, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid var(--color-border)',
                        padding: '8px',
                    }}
                >
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 500 : 400,
                                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                }}
                            >
                                <Icon size={18} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </motion.div>
            )}
        </motion.nav>
    );
}
