import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Target, Award, Grid3x3, Plus, X, Search } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import NineBoxGrid from './NineBoxGrid';
import { fetchSkills, fetchNineBox, createSkill } from '../../store/talentSlice';

const CATEGORY_MAP = {
    TECHNICAL: { label: 'Teknik', color: '#3b82f6' },
    SOFT_SKILL: { label: 'Davranışsal', color: '#10b981' },
    LEADERSHIP: { label: 'Liderlik', color: '#f59e0b' },
    DOMAIN: { label: 'Alan Bilgisi', color: '#8b5cf6' },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function TalentManagement() {
    const dispatch = useDispatch();
    const { skills, nineBox, loading } = useSelector(s => s.talent);
    const [tab, setTab] = useState('skills');
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', category: 'TECHNICAL', description: '' });

    useEffect(() => {
        dispatch(fetchSkills());
        dispatch(fetchNineBox());
    }, [dispatch]);

    const filtered = skills.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
    );

    const grouped = Object.entries(CATEGORY_MAP).map(([key, cfg]) => ({
        ...cfg,
        key,
        skills: filtered.filter(s => s.category === key),
    })).filter(g => g.skills.length > 0);

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createSkill(form)).then(() => {
            setShowModal(false);
            setForm({ name: '', category: 'TECHNICAL', description: '' });
        });
    };

    const stats = [
        { label: 'Toplam Yetkinlik', value: skills.length, icon: Target, color: '#3b82f6' },
        { label: 'Teknik', value: skills.filter(s => s.category === 'TECHNICAL').length, icon: Award, color: '#8b5cf6' },
        { label: '9-Box Çalışan', value: nineBox.length, icon: Grid3x3, color: '#10b981' },
    ];

    const tabs = [
        { id: 'skills', label: 'Yetkinlikler', icon: Target },
        { id: 'ninebox', label: '9-Box Grid', icon: Grid3x3 },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Yetenek Yönetimi</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Yetkinlik matrisi ve performans değerlendirme</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="btn-primary" style={{ gap: '6px' }}>
                    <Plus size={16} /> Yeni Yetkinlik
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {stats.map(s => {
                    const Icon = s.icon;
                    return (
                        <GlassCard key={s.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</p>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</span>
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                    <Icon size={18} />
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
                {tabs.map(t => {
                    const Icon = t.icon;
                    return (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: 'none',
                            background: tab === t.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                            color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                            fontSize: '0.82rem', fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer', transition: 'all var(--transition-fast)',
                        }}>
                            <Icon size={14} />{t.label}
                        </button>
                    );
                })}
            </motion.div>

            {/* Content */}
            {tab === 'skills' ? (
                <>
                    <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Yetkinlik ara..."
                                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.82rem', outline: 'none' }}
                            />
                        </div>
                    </motion.div>

                    {loading ? (
                        <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p>
                    ) : grouped.map(group => (
                        <motion.div key={group.key} variants={itemVariants} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: group.color }} />
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{group.label}</h3>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>({group.skills.length})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                                {group.skills.map(skill => (
                                    <GlassCard key={skill.id} hoverable>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{skill.name}</h4>
                                            <Badge status={skill.category === 'TECHNICAL' ? 'info' : skill.category === 'LEADERSHIP' ? 'warning' : 'success'}>
                                                {CATEGORY_MAP[skill.category]?.label}
                                            </Badge>
                                        </div>
                                        {skill.description && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{skill.description}</p>}
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </>
            ) : (
                <NineBoxGrid data={nineBox} loading={loading} />
            )}

            {/* Create Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
                        className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Yeni Yetkinlik</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Yetkinlik Adı *</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Kategori</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}>
                                    {Object.entries(CATEGORY_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Açıklama</label>
                                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                />
                            </div>
                            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary" style={{ width: '100%', padding: '11px' }}>
                                <Plus size={16} /> Oluştur
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
