import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Building2, Users, Briefcase, Plus, ChevronRight, Network, List, Search, X
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import OrgChart from './OrgChart';
import { fetchDepartments, fetchDepartmentTree, createDepartment } from '../../store/organizationSlice';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function Organization() {
    const dispatch = useDispatch();
    const { departments, tree, loading } = useSelector(s => s.organization);
    const [tab, setTab] = useState('list');
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', code: '', description: '', parentId: '' });

    useEffect(() => {
        dispatch(fetchDepartments());
        dispatch(fetchDepartmentTree());
    }, [dispatch]);

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.code && d.code.toLowerCase().includes(search.toLowerCase()))
    );

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createDepartment({
            ...form,
            parentId: form.parentId ? Number(form.parentId) : null,
        })).then(() => {
            setShowModal(false);
            setForm({ name: '', code: '', description: '', parentId: '' });
            dispatch(fetchDepartments());
            dispatch(fetchDepartmentTree());
        });
    };

    const stats = [
        { label: 'Toplam Departman', value: departments.length, icon: Building2, color: '#3b82f6' },
        { label: 'Kök Birim', value: departments.filter(d => !d.parentId).length, icon: Network, color: '#8b5cf6' },
        { label: 'Alt Birim', value: departments.filter(d => d.parentId).length, icon: ChevronRight, color: '#10b981' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                        Organizasyon
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        Departman yapısı ve organizasyon şeması
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                    style={{ gap: '6px' }}
                >
                    <Plus size={16} /> Yeni Departman
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
                {[{ id: 'list', label: 'Departmanlar', icon: List }, { id: 'chart', label: 'Org Chart', icon: Network }].map(t => {
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
            {tab === 'list' ? (
                <>
                    {/* Search */}
                    <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Departman ara..."
                                style={{
                                    width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)',
                                    color: 'var(--color-text-primary)', fontSize: '0.82rem', outline: 'none',
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Department Grid */}
                    <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                        {loading ? (
                            <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p>
                        ) : filtered.map(dept => (
                            <GlassCard key={dept.id} hoverable>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dept.name}</h3>
                                            {dept.code && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{dept.code}</span>}
                                        </div>
                                    </div>
                                    <Badge status={dept.parentId ? 'info' : 'success'}>{dept.parentId ? 'Alt Birim' : 'Kök'}</Badge>
                                </div>
                                {dept.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>{dept.description}</p>}
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {dept.parentName && <span>↑ {dept.parentName}</span>}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {dept.employeeCount} çalışan</span>
                                    {dept.subDepartmentCount > 0 && <span>{dept.subDepartmentCount} alt birim</span>}
                                </div>
                            </GlassCard>
                        ))}
                    </motion.div>
                </>
            ) : (
                <OrgChart tree={tree} loading={loading} />
            )}

            {/* Create Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
                        className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Yeni Departman</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            {[
                                { label: 'Departman Adı *', name: 'name', required: true },
                                { label: 'Kod', name: 'code' },
                                { label: 'Açıklama', name: 'description' },
                            ].map(f => (
                                <div key={f.name} style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>{f.label}</label>
                                    <input
                                        value={form[f.name]}
                                        onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                        required={f.required}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                        onFocus={e => e.target.style.borderColor = 'var(--color-accent-primary)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                                    />
                                </div>
                            ))}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Üst Departman</label>
                                <select
                                    value={form.parentId}
                                    onChange={e => setForm({ ...form, parentId: e.target.value })}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    <option value="">— Kök Departman —</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
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
