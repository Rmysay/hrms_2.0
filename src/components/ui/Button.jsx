import { motion } from 'framer-motion';

const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
};

export default function Button({
    children,
    variant = 'primary',
    icon: Icon,
    iconRight: IconRight,
    className = '',
    disabled = false,
    ...props
}) {
    return (
        <motion.button
            className={`${variants[variant] || variants.primary} ${className}`}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            disabled={disabled}
            style={{
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
            }}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
            {IconRight && <IconRight size={16} />}
        </motion.button>
    );
}
