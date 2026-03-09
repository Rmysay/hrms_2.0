import { motion } from 'framer-motion';
import { User, Mail, Phone, ChevronRight, MessageSquare } from 'lucide-react';

const PIPELINE_COLUMNS = [
    { status: 'APPLIED', label: 'Başvurdu', color: '#64748b', bg: '#64748b15' },
    { status: 'SCREENING', label: 'Ön Eleme', color: '#3b82f6', bg: '#3b82f615' },
    { status: 'INTERVIEW', label: 'Mülakat', color: '#f59e0b', bg: '#f59e0b15' },
    { status: 'OFFERED', label: 'Teklif', color: '#8b5cf6', bg: '#8b5cf615' },
    { status: 'HIRED', label: 'İşe Alındı', color: '#10b981', bg: '#10b98115' },
    { status: 'REJECTED', label: 'Reddedildi', color: '#ef4444', bg: '#ef444415' },
];

export default function ApplicationPipeline({ applications, loading, onStatusUpdate }) {
    if (loading) return <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>Yükleniyor...</p>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: `repeat(${PIPELINE_COLUMNS.length}, minmax(170px, 1fr))`, gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {PIPELINE_COLUMNS.map(col => {
                const items = (applications || []).filter(a => a.status === col.status);
                return (
                    <div key={col.status} style={{ minWidth: '170px' }}>
                        {/* Column Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px',
                            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                            background: col.bg, borderLeft: `3px solid ${col.color}`,
                        }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: col.color }}>{col.label}</span>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 600, padding: '1px 6px', borderRadius: 'var(--radius-full)',
                                background: `${col.color}25`, color: col.color,
                            }}>{items.length}</span>
                        </div>

                        {/* Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(app => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    style={{
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                >
                                    {/* Name */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                        <div style={{
                                            width: '26px', height: '26px', borderRadius: 'var(--radius-full)',
                                            background: `linear-gradient(135deg, ${col.color}, ${col.color}aa)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.6rem', fontWeight: 600, color: '#fff', flexShrink: 0,
                                        }}>
                                            {app.candidateName?.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {app.candidateName}
                                        </span>
                                    </div>

                                    {/* Job Title */}
                                    {app.jobTitle && (
                                        <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            📋 {app.jobTitle}
                                        </p>
                                    )}

                                    {/* Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={10} /> {app.candidateEmail}
                                        </span>
                                        {app.candidatePhone && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Phone size={10} /> {app.candidatePhone}
                                            </span>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {app.notes && (
                                        <div style={{ marginTop: '6px', padding: '4px 6px', borderRadius: '4px', background: 'rgba(148,163,184,0.06)', fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>
                                            <MessageSquare size={9} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                                            {app.notes}
                                        </div>
                                    )}

                                    {/* Status actions */}
                                    {col.status !== 'HIRED' && col.status !== 'REJECTED' && onStatusUpdate && (
                                        <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                                            {getNextStatuses(col.status).map(next => (
                                                <button key={next.status} onClick={() => onStatusUpdate(app.id, next.status)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '3px',
                                                        padding: '3px 8px', borderRadius: '4px', border: 'none',
                                                        background: `${next.color}15`, color: next.color,
                                                        fontSize: '0.6rem', fontWeight: 500, cursor: 'pointer',
                                                    }}>
                                                    <ChevronRight size={8} />{next.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {items.length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                                    Aday yok
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </motion.div>
    );
}

function getNextStatuses(current) {
    const flow = {
        APPLIED: [{ status: 'SCREENING', label: 'Ön Eleme', color: '#3b82f6' }, { status: 'REJECTED', label: 'Reddet', color: '#ef4444' }],
        SCREENING: [{ status: 'INTERVIEW', label: 'Mülakat', color: '#f59e0b' }, { status: 'REJECTED', label: 'Reddet', color: '#ef4444' }],
        INTERVIEW: [{ status: 'OFFERED', label: 'Teklif', color: '#8b5cf6' }, { status: 'REJECTED', label: 'Reddet', color: '#ef4444' }],
        OFFERED: [{ status: 'HIRED', label: 'İşe Al', color: '#10b981' }, { status: 'REJECTED', label: 'Reddet', color: '#ef4444' }],
    };
    return flow[current] || [];
}
