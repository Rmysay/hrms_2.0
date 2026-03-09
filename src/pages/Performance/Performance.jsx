import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Plus, X, Search } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { fetchReviews, fetchAwards, createAward } from '../../store/performanceSlice';

const AWARD_MAP = {
    EMPLOYEE_OF_MONTH: { label: 'Ayın Çalışanı', emoji: '🏆' },
    INNOVATION: { label: 'İnovasyon', emoji: '💡' },
    TEAMWORK: { label: 'Takım Ruhu', emoji: '🤝' },
    LEADERSHIP: { label: 'Liderlik', emoji: '👑' },
    CUSTOMER_FOCUS: { label: 'Müşteri Odaklılık', emoji: '🎯' },
    PERFORMANCE: { label: 'Performans', emoji: '📈' },
};

const SCORE_MAP = { 1: { label: 'Yetersiz', color: '#ef4444' }, 2: { label: 'Gelişmeli', color: '#f59e0b' }, 3: { label: 'Yeterli', color: '#64748b' }, 4: { label: 'İyi', color: '#3b82f6' }, 5: { label: 'Mükemmel', color: '#10b981' } };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

export default function Performance() {
    const dispatch = useDispatch();
    const { reviews, awards, loading } = useSelector(s => s.performance);
    const [tab, setTab] = useState('reviews');
    const [search, setSearch] = useState('');
    const [showAwardModal, setShowAwardModal] = useState(false);
    const [awardForm, setAwardForm] = useState({ employeeId: '', title: '', type: 'EMPLOYEE_OF_MONTH', description: '', awardDate: '' });

    useEffect(() => { dispatch(fetchReviews()); dispatch(fetchAwards()); }, [dispatch]);

    const filteredReviews = reviews.filter(r => r.employeeName?.toLowerCase().includes(search.toLowerCase()) || r.period?.toLowerCase().includes(search.toLowerCase()));

    const avgScore = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.overallScore, 0) / reviews.length).toFixed(1) : '—';

    const handleCreateAward = (e) => {
        e.preventDefault();
        dispatch(createAward({ ...awardForm, employeeId: Number(awardForm.employeeId), awardDate: awardForm.awardDate || null })).then(() => {
            setShowAwardModal(false);
            setAwardForm({ employeeId: '', title: '', type: 'EMPLOYEE_OF_MONTH', description: '', awardDate: '' });
        });
    };

    const stats = [
        { label: 'Değerlendirme', value: reviews.length, icon: Star, color: '#3b82f6' },
        { label: 'Ort. Puan', value: avgScore, icon: TrendingUp, color: '#10b981' },
        { label: 'Ödül', value: awards.length, icon: Award, color: '#f59e0b' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Performans & Ödül</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Performans değerlendirme ve ödül yönetimi</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAwardModal(true)} className="btn-primary" style={{ gap: '6px' }}>
                    <Plus size={16} /> Ödül Ver
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {stats.map(s => {
                    const Icon = s.icon; return (
                        <GlassCard key={s.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</p>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</span>
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}><Icon size={18} /></div>
                            </div>
                        </GlassCard>
                    );
                })}
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
                {[{ id: 'reviews', label: 'Değerlendirmeler', icon: Star }, { id: 'awards', label: 'Ödüller', icon: Award }].map(t => {
                    const Icon = t.icon;
                    return <button key={t.id} onClick={() => setTab(t.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: 'none',
                        background: tab === t.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                        color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        fontSize: '0.82rem', fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer',
                    }}><Icon size={14} />{t.label}</button>;
                })}
            </motion.div>

            {/* Content */}
            {tab === 'reviews' ? (
                <>
                    <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Çalışan veya dönem ara..."
                                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.82rem', outline: 'none' }} />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {loading ? <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p> :
                            filteredReviews.map(review => {
                                const scoreInfo = SCORE_MAP[review.overallScore] || SCORE_MAP[3];
                                return (
                                    <GlassCard key={review.id} hoverable>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: '200px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                                                        {review.employeeName?.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{review.employeeName}</h3>
                                                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{review.employeeDepartment} · {review.period}</span>
                                                    </div>
                                                </div>
                                                {review.goals && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '8px', whiteSpace: 'pre-line' }}>{review.goals}</p>}
                                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                                                    {review.strengths && <span style={{ color: '#10b981' }}>💪 {review.strengths.substring(0, 60)}...</span>}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: scoreInfo.color }}>{review.overallScore}</div>
                                                <Badge status={review.overallScore >= 4 ? 'success' : review.overallScore >= 3 ? 'info' : 'warning'}>{scoreInfo.label}</Badge>
                                            </div>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                    </motion.div>
                </>
            ) : (
                <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                    {awards.map(award => (
                        <GlassCard key={award.id} hoverable>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>
                                    {AWARD_MAP[award.type]?.emoji || '🏅'}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{award.title}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{award.employeeName}</p>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                        <Badge status="warning">{AWARD_MAP[award.type]?.label || award.type}</Badge>
                                        {award.awardDate && <span>📅 {award.awardDate}</span>}
                                    </div>
                                    {award.description && <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>{award.description}</p>}
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </motion.div>
            )}

            {/* Award Modal */}
            {showAwardModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAwardModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
                        className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Ödül Ver</h2>
                            <button onClick={() => setShowAwardModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreateAward}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Çalışan ID *</label>
                                <input type="number" value={awardForm.employeeId} onChange={e => setAwardForm({ ...awardForm, employeeId: e.target.value })} required
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Ödül Başlığı *</label>
                                <input value={awardForm.title} onChange={e => setAwardForm({ ...awardForm, title: e.target.value })} required
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Tür</label>
                                    <select value={awardForm.type} onChange={e => setAwardForm({ ...awardForm, type: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}>
                                        {Object.entries(AWARD_MAP).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Tarih</label>
                                    <input type="date" value={awardForm.awardDate} onChange={e => setAwardForm({ ...awardForm, awardDate: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Açıklama</label>
                                <input value={awardForm.description} onChange={e => setAwardForm({ ...awardForm, description: e.target.value })}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                            </div>
                            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary" style={{ width: '100%', padding: '11px' }}>
                                <Award size={16} /> Ödül Ver
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
