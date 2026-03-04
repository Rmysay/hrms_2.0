import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Target,
    Briefcase,
    Award,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organization', label: 'Organizasyon', icon: Building2 },
    { path: '/talent', label: 'Yetenek Yönetimi', icon: Target },
    { path: '/recruitment', label: 'İşe Alma', icon: Briefcase },
    { path: '/performance', label: 'Performans', icon: Award },
    { path: '/employees', label: 'Çalışanlar', icon: Users },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: '64px',
                background: 'rgba(10, 14, 26, 0.6)',
                borderRight: '1px solid var(--color-border)',
                padding: collapsed ? '16px 12px' : '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                overflow: 'hidden',
                flexShrink: 0,
            }}
        >
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: collapsed ? '10px' : '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 500 : 400,
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                            transition: 'all var(--transition-fast)',
                            whiteSpace: 'nowrap',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <Icon size={18} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                );
            })}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                }}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                {!collapsed && <span>Daralt</span>}
            </button>
        </motion.aside>
    );
}
