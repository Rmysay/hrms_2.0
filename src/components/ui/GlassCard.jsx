import { motion } from 'framer-motion';

export default function GlassCard({
    title,
    icon: Icon,
    children,
    className = '',
    hoverable = true,
    onClick,
    ...props
}) {
    const Component = hoverable ? motion.div : 'div';
    const motionProps = hoverable ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    } : {};

    return (
        <Component
            className={`glass-card p-6 ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            {...motionProps}
            {...props}
        >
            {(Icon || title) && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: children ? '16px' : '0'
                }}>
                    {Icon && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-accent-glow)',
                            color: 'var(--color-accent-primary)',
                        }}>
                            <Icon size={20} />
                        </div>
                    )}
                    {title && (
                        <h3 style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            margin: 0,
                        }}>
                            {title}
                        </h3>
                    )}
                </div>
            )}
            {children}
        </Component>
    );
}
