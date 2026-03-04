import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronRight, Users, User } from 'lucide-react';

function TreeNode({ node, level = 0 }) {
    const [expanded, setExpanded] = useState(level < 2);
    const hasChildren = node.children && node.children.length > 0;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    const color = colors[level % colors.length];

    return (
        <div style={{ paddingLeft: level > 0 ? '32px' : 0 }}>
            {/* Connector line */}
            {level > 0 && (
                <div style={{
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        left: '-16px',
                        top: '20px',
                        width: '16px',
                        height: '1px',
                        background: 'var(--color-border)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        left: '-16px',
                        top: '-12px',
                        width: '1px',
                        height: '32px',
                        background: 'var(--color-border)',
                    }} />
                </div>
            )}

            {/* Node Card */}
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: level * 0.05 }}
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${expanded && hasChildren ? `${color}30` : 'var(--glass-border)'}`,
                    marginBottom: '8px',
                    cursor: hasChildren ? 'pointer' : 'default',
                    transition: 'all var(--transition-fast)',
                }}
            >
                {/* Expand Icon */}
                {hasChildren && (
                    <motion.div
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                    >
                        <ChevronRight size={14} />
                    </motion.div>
                )}
                {!hasChildren && <div style={{ width: '14px' }} />}

                {/* Department Icon */}
                <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    flexShrink: 0,
                }}>
                    <Building2 size={16} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {node.name}
                        </span>
                        {node.code && (
                            <span style={{
                                fontSize: '0.65rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: `${color}15`,
                                color: color,
                                fontWeight: 500,
                            }}>
                                {node.code}
                            </span>
                        )}
                    </div>
                    {node.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {node.description}
                        </p>
                    )}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    {node.managerName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                            <User size={12} />
                            {node.managerName}
                        </div>
                    )}
                    {hasChildren && (
                        <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(148,163,184,0.08)',
                            color: 'var(--color-text-muted)',
                        }}>
                            {node.children.length} alt birim
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Children */}
            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                    >
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function OrgChart({ tree, loading }) {
    if (loading) {
        return <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p>;
    }

    if (!tree || tree.length === 0) {
        return <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Henüz departman eklenmemiş.</p>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '8px 0' }}
        >
            {tree.map(root => (
                <TreeNode key={root.id} node={root} level={0} />
            ))}
        </motion.div>
    );
}
