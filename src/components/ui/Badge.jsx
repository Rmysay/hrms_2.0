const statusStyles = {
    success: {
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    warning: {
        background: 'rgba(245, 158, 11, 0.1)',
        color: '#f59e0b',
        border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    danger: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    info: {
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.2)',
    },
};

export default function Badge({ children, status = 'info', className = '' }) {
    const style = statusStyles[status] || statusStyles.info;

    return (
        <span
            className={className}
            style={{
                ...style,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.025em',
            }}
        >
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: style.color,
            }} />
            {children}
        </span>
    );
}
